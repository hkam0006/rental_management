'use client'
import Card from '@/components/Card'
import Header from '@/components/Header'
import LoadingComponent from '@/components/LoadingComponent'
import { useGetAuthUserQuery, useGetManagerPropertiesQuery, useGetPropertiesQuery, useGetTenantQuery } from '@/state/api'
import React from 'react'

const ManagerPropertiesPage = () => {
  const {data: authUser} = useGetAuthUserQuery()
  const {
    data: managerProperties,
    isLoading,
    error
  } = useGetManagerPropertiesQuery(
    authUser?.cognitoInfo?.userId || "",
    {skip: !authUser?.cognitoInfo?.userId}
  )

  if (isLoading) return <LoadingComponent />
  if (error) return <div>Error loading manager properties</div>

  return (
    <div className='dashboard-container'>
      <Header 
        title='Manager Properties'
        subtitle='Properties that you manage'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {managerProperties?.map((property) => (
          <Card 
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>You don&lsquo;t manage any properties</p>
      )}
    </div>
  )
}

export default ManagerPropertiesPage
