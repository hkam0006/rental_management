'use client'
import LoadingComponent from '@/components/LoadingComponent'
import SettingsForm from '@/components/SettingsForm'
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '@/state/api'
import React from 'react'

const ManagerSettings = () => {
  const {data: authUser, isLoading: authLoading} = useGetAuthUserQuery()
  const [updateManager] = useUpdateManagerSettingsMutation()
  if (authLoading) return <LoadingComponent />

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber
  }

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.cognitoInfo.userId,
      ...data
    })
  }

  return (
    <SettingsForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      userType={"manager"}
    />
  )
}

export default ManagerSettings
