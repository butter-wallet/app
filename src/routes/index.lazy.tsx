import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { sdkHasLoaded } = useDynamicContext()
  const isAuthenticated = useIsLoggedIn()

  if (sdkHasLoaded && isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <DynamicWidget />
    </div>
  )
}
