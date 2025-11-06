import React, {useState, useMemo, useEffect} from 'react'
import {
  User,
  UserRole,
  DepositRequest,
  RequestStatus,
  Notification,
  WithdrawalRequest,
  LoginResponse,
  DailyClaim,
  MonthlyReward
} from '../../types'
import LandingPage from '../LandingPage'
import LoginPage from '../LoginPage'
import SignupPage from '../SignupPage'
import UserApp from '../user/UserApp'
import AdminApp from './AdminApp'
import ForgotPasswordPage from '../ForgotPasswordPage'
import OtpVerificationPage from '../OtpVerificationPage'
import ResetPasswordPage from '../ResetPasswordPage'
import EmailVerificationPage from '../EmailVerificationPage'
import api from '../../services/api'
import {
  processUser,
  processDepositRequest,
  processWithdrawalRequest,
  processNotification,
  processDashboardData
} from '../../processors'
import TermsPage from '../user/TermsPage'

type DashboardStats = {
  deposits: {
    approved: {count: number; totalAmount: number}
    pending: {count: number; totalAmount: number}
  }
  withdrawals: {
    approved: {count: number; totalAmount: number}
    pending: {count: number; totalAmount: number}
  }
  users: {
    totalUser: number
    activeCount: number
    inactiveCount: number
  }
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<
    | 'landing'
    | 'login'
    | 'signup'
    | 'otp-verification'
    | 'forgot-password'
    | 'reset-password'
    | 'email-verification'
    | 'terms'
  >('landing')
  const [otpPurpose, setOtpPurpose] = useState<'signup' | 'reset-password'>(
    'signup'
  )
  const [emailForVerification, setEmailForVerification] = useState<string>('')
  const [resetToken, setResetToken] = useState<string>('')
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([])
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState<string | null>(
    null
  )
  const [dailyClaim, setDailyClaim] = useState<DailyClaim | null>(null)
  const [monthlyReward, setMonthlyReward] = useState<MonthlyReward | null>(null)
  const [adminDashboardStats, setAdminDashboardStats] =
    useState<DashboardStats | null>(null)

  const refetchDashboardData = async () => {
    try {
      const dashboardData: any = await api.get('/api/dashboard')
      const {user, notifications, dailyClaim, monthlyReward} =
        processDashboardData(dashboardData)
      setCurrentUser(user)
      setNotifications(notifications)
      setDailyClaim(dailyClaim)
      setMonthlyReward(monthlyReward)
    } catch (error) {
      console.error('Failed to refetch dashboard data:', error)
    }
  }

  const refetchAdminData = async () => {
    try {
      const [
        usersResponse,
        depositsResponse,
        withdrawalsResponse,
        notificationsResponse,
        dashboardStats
      ]: any[] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/deposits'),
        api.get('/api/admin/withdrawals'),
        api.get('/api/admin/notifications'),
        api.get('/api/admin/dashboard-stats')
      ])
      const processedUsers = (usersResponse.results || []).map(processUser)
      setUsers(processedUsers)
      setDepositRequests(
        (depositsResponse.results || []).map(processDepositRequest)
      )
      setWithdrawalRequests(
        (withdrawalsResponse.results || []).map(processWithdrawalRequest)
      )
      setNotifications(
        (notificationsResponse.results || []).map(processNotification)
      )
      setAdminDashboardStats(dashboardStats as DashboardStats)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      setUsers([])
      setDepositRequests([])
      setWithdrawalRequests([])
      setNotifications([])
      setAdminDashboardStats(null)
    }
  }

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const userProfile = await api.get<any>('/api/users/me')
          setCurrentUser(processUser(userProfile))
        } catch (error) {
          console.error('Session check failed:', error)
          localStorage.removeItem('authToken')
        }
      }
      setAppIsLoading(false)
    }

    checkUserStatus()

    // --- Start: Path-based routing for referral links ---
    const path = window.location.pathname
    const urlParams = new URLSearchParams(window.location.search)

    let referralCode: string | null = null

    if (path.toLowerCase().startsWith('/register') && urlParams.has('ref')) {
      referralCode = urlParams.get('ref')
    }

    const pathParts = path.split('/')
    if (pathParts[1] && pathParts[1].toLowerCase() === 'ref' && pathParts[2]) {
      referralCode = decodeURIComponent(pathParts[2])
    }

    if (referralCode) {
      setReferralCodeFromUrl(referralCode)
      setCurrentPage('signup')
    }
    // --- End: Path-based routing ---
  }, [])

  useEffect(() => {
    if (!currentUser) return

    let intervalId: ReturnType<typeof setInterval> | undefined

    const fetchData = async () => {
      if (currentUser.role === UserRole.ADMIN) {
        await refetchAdminData()
      } else if (currentUser.role === UserRole.USER) {
        await refetchDashboardData()
      }
    }

    fetchData()

    if (currentUser.role === UserRole.ADMIN) {
      intervalId = setInterval(async () => {
        try {
          const [
            depositsResponse,
            withdrawalsResponse,
            notificationsResponse,
            dashboardStats
          ]: any[] = await Promise.all([
            api.get('/api/admin/deposits'),
            api.get('/api/admin/withdrawals'),
            api.get('/api/admin/notifications'),
            api.get('/api/admin/dashboard-stats')
          ])
          setDepositRequests(
            (depositsResponse.results || []).map(processDepositRequest)
          )
          setWithdrawalRequests(
            (withdrawalsResponse.results || []).map(processWithdrawalRequest)
          )
          setNotifications(
            (notificationsResponse.results || []).map(processNotification)
          )
          setAdminDashboardStats(dashboardStats as DashboardStats)
        } catch (error) {
          console.error('Polling for admin data failed:', error)
        }
      }, 30000) // Poll every 30 seconds
    } else if (currentUser.role === UserRole.USER) {
      intervalId = setInterval(refetchDashboardData, 30000) // Poll every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id])

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notificationId ? {...n, isRead: true} : n
      )
    )
  }

  const unreadAdminNotifications = useMemo(() => {
    return notifications.filter(n => !n.isRead)
  }, [notifications])

  const unreadUserNotifications = useMemo(() => {
    if (currentUser && currentUser.role === UserRole.USER) {
      return notifications.filter(
        n => !n.isRead && (!n.userId || n.userId === currentUser.id)
      )
    }
    return []
  }, [notifications, currentUser])

  const handleLogin = async (credentials: {
    email: string
    password: string
  }) => {
    const response = await api.post<LoginResponse>(
      '/api/auth/login',
      credentials,
      true
    )
    localStorage.setItem('authToken', response.token)
    let user = processUser(response.user)

    if (!user.timeZone) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const updatedUserFromApi = await api.put<any>('/api/users/me', {
          timeZone
        })
        user = processUser({...user, ...updatedUserFromApi})
      } catch (error) {
        console.error('Failed to update user timezone on login:', error)
      }
    }

    setCurrentUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setCurrentUser(null)
    setCurrentPage('landing')
  }

  const handleSignup = async (signupData: object) => {
    const {phone, referredBy, ...rest}: any = signupData
    const payload = {...rest, referralCode: referredBy || ''}
    await api.post('/api/auth/register', payload, true)
    setEmailForVerification((signupData as any).email)
    setCurrentPage('email-verification')
  }

  const handleSendOtp = async (email: string) => {
    await api.post('/api/auth/forgot-password', {email}, true)
    setEmailForVerification(email)
    setOtpPurpose('reset-password')
    setCurrentPage('otp-verification')
  }

  const handleOtpVerification = async (otp: string) => {
    if (otpPurpose === 'signup') {
      setCurrentPage('login')
    } else {
      await api.post('/api/auth/verify-reset-otp', {otp}, true)
      setResetToken(otp)
      setCurrentPage('reset-password')
    }
  }

  const handlePasswordReset = async (password: string) => {
    await api.post(
      '/api/auth/set-new-password',
      {email: emailForVerification, password, resetToken},
      true
    )
    setCurrentPage('login')
    setResetToken('')
  }

  const updateRequestStatus = async (
    id: string,
    status: 'approved' | 'declined',
    data?: {reason: string}
  ) => {
    try {
      if (status === 'approved') {
        await api.put(`/api/admin/transactions/deposits/${id}/approve`)
      } else {
        await api.put(`/api/admin/transactions/deposits/${id}/decline`, {
          reason: data?.reason
        })
      }
      setDepositRequests(prev =>
        prev.map(req =>
          req.id === id
            ? {
                ...req,
                status:
                  status === 'approved'
                    ? RequestStatus.APPROVED
                    : RequestStatus.DECLINED
              }
            : req
        )
      )
    } catch (error) {
      console.error(`Failed to update deposit status for ${id}`, error)
    }
  }

  const addWithdrawalRequest = async (data: {
    amount: number
    walletAddress: string
    walletName: string
    network: string
  }) => {
    if (!currentUser) return
    const payload = {
      amount: data.amount,
      destinationAddress: data.walletAddress,
      walletName: data.walletName,
      network: data.network
    }
    await api.post<any>('/api/withdrawals', payload)
  }

  const updateWithdrawalRequestStatus = async (
    id: string,
    status: 'approved' | 'declined',
    data?: {reason: string}
  ) => {
    try {
      if (status === 'approved') {
        await api.put(`/api/admin/transactions/withdrawals/${id}/approve`)
      } else {
        await api.put(`/api/admin/transactions/withdrawals/${id}/decline`, {
          reason: data?.reason
        })
      }
      setWithdrawalRequests(prev =>
        prev.map(req =>
          req.id === id
            ? {
                ...req,
                status:
                  status === 'approved'
                    ? RequestStatus.APPROVED
                    : RequestStatus.DECLINED
              }
            : req
        )
      )
    } catch (error) {
      console.error(`Failed to update withdrawal status for ${id}`, error)
    }
  }

  const handleUpdateUser = async (
    updatedData: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>
  ) => {
    const {email, ...payload} = updatedData
    const updatedUserFromApi = await api.put<any>('/api/users/me', payload)
    setCurrentUser(prev =>
      prev ? processUser({...prev, ...updatedUserFromApi}) : null
    )
  }

  const addNotification = async (data: {
    title: string
    content: string
    userId?: string
  }) => {
    const payload = {
      title: data.title,
      message: data.content,
      userId: data.userId
    }
    let newNotificationFromApi: any

    if (payload.userId) {
      newNotificationFromApi = await api.post(
        '/api/notifications/admin/user',
        payload
      )
    } else {
      newNotificationFromApi = await api.post(
        '/api/notifications/admin/global',
        {title: payload.title, message: payload.message}
      )
    }
    setNotifications(prev => [
      processNotification(newNotificationFromApi),
      ...prev
    ])
  }

  const updateNotification = async (updatedNotification: Notification) => {
    const payload = {
      title: updatedNotification.title,
      message: updatedNotification.content
    }
    await api.put(`/api/admin/notifications/${updatedNotification.id}`, payload)
    setNotifications(prev =>
      prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n))
    )
  }

  const deleteNotification = async (id: string) => {
    await api.delete(`/api/admin/notifications/${id}`)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (appIsLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-brand-dark'>
        <p className='text-white text-xl'>Loading...</p>
      </div>
    )
  }

  if (!currentUser) {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigate={setCurrentPage}
          />
        )
      case 'signup':
        return (
          <SignupPage
            onSignup={handleSignup}
            onNavigate={setCurrentPage}
            referralCode={referralCodeFromUrl}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onSendOtp={handleSendOtp}
            onNavigate={setCurrentPage}
          />
        )
      case 'otp-verification':
        return (
          <OtpVerificationPage
            onVerify={handleOtpVerification}
            purpose={otpPurpose}
          />
        )
      case 'reset-password':
        return <ResetPasswordPage onReset={handlePasswordReset} />
      case 'email-verification':
        return (
          <EmailVerificationPage
            email={emailForVerification}
            onNavigate={setCurrentPage}
          />
        )
      case 'terms':
        return <TermsPage onBack={() => setCurrentPage('landing')} />
      default:
        return <LandingPage onNavigate={setCurrentPage} />
    }
  }

  if (currentUser.role === UserRole.ADMIN) {
    return (
      <AdminApp
        user={currentUser}
        users={users}
        requests={depositRequests}
        withdrawalRequests={withdrawalRequests}
        onUpdateRequestStatus={updateRequestStatus}
        onUpdateWithdrawalRequestStatus={updateWithdrawalRequestStatus}
        onLogout={handleLogout}
        notifications={unreadAdminNotifications}
        onAddNotification={addNotification}
        onUpdateNotification={updateNotification}
        onDeleteNotification={deleteNotification}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        // ↓ NEW: pass dashboard stats fetched here
        // @ts-ignore  // Remove this if AdminApp props already include `dashboardStats`
        dashboardStats={adminDashboardStats}
      />
    )
  }

  return (
    <UserApp
      user={currentUser}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
      notifications={unreadUserNotifications}
      onAddWithdrawalRequest={addWithdrawalRequest}
      dailyClaim={dailyClaim}
      monthlyReward={monthlyReward}
      onRefetchData={refetchDashboardData}
      onMarkNotificationAsRead={handleMarkNotificationAsRead}
    />
  )
}

export default App