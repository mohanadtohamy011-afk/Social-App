import React from 'react'
import { Navigate } from 'react-router'
import { useTokenContext } from '../../Context/TokenContext'


export default function AppProtectedRoute({ children }: { children: React.ReactNode }) {


    
    const {token} = useTokenContext()
    return token ? <>{children}</> : <Navigate to="/auth/login" replace />
}
