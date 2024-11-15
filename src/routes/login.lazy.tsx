import {
  DynamicWidget,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: Login,
})

function Login() {
  const isAuthenticated = useIsLoggedIn()
  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="p-2">
      <DynamicWidget />
    </div>
  )
}
