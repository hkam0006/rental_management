'use client'
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { useAppSelector } from '@/state/redux'
import { useGetPropertiesQuery } from '@/state/api'
import { Property } from '@/types/prismaTypes'
import LoadingComponent from '@/components/LoadingComponent'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

const Map = () => {
  const mapContainerRef = useRef(null)
  const filters = useAppSelector((state) => state.global.filters)
  const {
    data: properties,
    isLoading,
    isError
  } = useGetPropertiesQuery(filters)

  useEffect(() => {
    if (isLoading || isError || !properties) return 

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      center: filters.coordinates || [-74.5, 40],
      zoom: 9
    })

    properties.map(p => createPropertyMarker(p, map))

    const resizeMap = () => setTimeout(() => map.resize(), 700)
    resizeMap()

    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates])
  if (isLoading) return <LoadingComponent />
  if (isError || !properties) return <div>Failed to fetch properties</div>

  
  return (
    <div className='basis-5/12 grow relative rounded-xl'>
      <div className='map-container rounded-xl' ref={mapContainerRef} style={{height: "100%", width: "100%"}} />
    </div>
  )
}

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    ).addTo(map)

    return marker
}

export default Map
