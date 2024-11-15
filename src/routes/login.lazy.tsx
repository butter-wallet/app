import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: Login,
})

function Login() {
  const { sdkHasLoaded } = useDynamicContext()
  const isAuthenticated = useIsLoggedIn()

  if (sdkHasLoaded && isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="p-2">
      <DynamicWidget />
    </div>
  )
}