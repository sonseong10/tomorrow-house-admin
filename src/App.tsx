import React, { useState, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './styles/main.css'
import { useAuth } from 'pages/auth/authHook'
import { ThemeProvider, type DefaultTheme } from 'styled-components'
import { lightTheme } from 'styles/theme'
import { GlobalStyle } from 'styles/globalStyle'
import Popup from 'commons/popup/PopupController'
import LoadingView from 'commons/loading/LoadingView'
import Spinner from 'components/ui/Spinner'
import LayerController from 'commons/layers/LayerController'

const HomePage = lazy(() => import('pages/home/home-page'))
const MemberRoute = lazy(() => import('pages/member'))
const WorkRoutes = lazy(() => import('pages/work'))
const ProductList = lazy(() => import('pages/product/list'))
const NotPage = lazy(() => import('pages/errors/not-page'))
const Login = lazy(() => import('pages/auth/login'))
const MainContent = lazy(() => import('components/layout/mainContent'))
const ProductDetail = lazy(() => import('pages/product/detail'))

function App() {
  const { onLogin } = useAuth()

  const [theme] = useState<DefaultTheme>(lightTheme)
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Popup />
      <LoadingView />
      <LayerController />
      <div>
        <Routes>
          <Route index element={<Login onLogin={onLogin} />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Spinner />}>
                <MainContent />
              </Suspense>
            }
          >
            <Route
              path="main/*"
              element={
                <Suspense fallback={<Spinner />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="member/*"
              element={
                <Suspense fallback={<Spinner />}>
                  <MemberRoute />
                </Suspense>
              }
            />
            <Route
              path="work/*"
              element={
                <Suspense fallback={<Spinner />}>
                  <WorkRoutes />
                </Suspense>
              }
            />
            <Route path="product/*">
              <Route
                path="list/*"
                element={
                  <Suspense fallback={<Spinner />}>
                    <ProductList />
                  </Suspense>
                }
              ></Route>
              <Route
                path="info/*"
                element={
                  <Suspense fallback={<Spinner />}>
                    <ProductDetail />
                  </Suspense>
                }
              ></Route>
              <Route
                path="*"
                element={
                  <Suspense fallback={<Spinner />}>
                    <NotPage></NotPage>
                  </Suspense>
                }
              ></Route>
            </Route>
            <Route
              path="*"
              element={
                <Suspense fallback={<Spinner />}>
                  <NotPage></NotPage>
                </Suspense>
              }
            ></Route>
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
