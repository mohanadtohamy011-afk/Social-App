import React from 'react'
import { Navigate } from 'react-router'
import { useTokenContext } from '../../Context/TokenContext'


export default function AuthProtectedRoute({ children }: { children: React.ReactNode }) {


   const {token} = useTokenContext()
   return token ? <Navigate to="/feed" replace /> : <>{children}</>
}
