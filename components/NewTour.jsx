'use client'

import toast from 'react-hot-toast'
import TourInfo from '@/components/TourInfo'
import { useMutation, useQuery } from '@tanstack/react-query'
import { generateTourResponse } from '@/utils/actions'
import axios from 'axios'
const url = `https://api.unsplash.com/search/photos?client_id=lyJKwwNYkvADe_s4-s7TEvNdklbd_HzelHB4g3G8VAE&query=`

const NewTour = () => {
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const newTour = await generateTourResponse(destination)

      if (newTour.tour) {
        toast.success(`${newTour.tokens} tokens used.`)
        return newTour.tour
      }
      toast.error('Please provide valid city / country...')
      return null
    },
  })

  const data = useQuery({
    queryKey: ['unsplash', tour],
    queryFn: async () => {
      const response = await axios(`${url}${tour.city}`)
      return response
    },
  })

  const tourImage = data?.data?.data?.results[0]?.urls.raw

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const destination = Object.fromEntries(formData.entries())
    mutate(destination)
  }

  if (isPending) {
    return <span className='loading loading-lg'></span>
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='max-w-2xl'>
        <h2 className=' mb-4'>Select your dream destination</h2>
        <div className='join w-full'>
          <input
            type='text'
            className='input input-bordered join-item w-full'
            placeholder='city'
            name='city'
            required
          />
          <input
            type='text'
            className='input input-bordered join-item w-full'
            placeholder='country'
            name='country'
            required
          />
          <button className='btn btn-primary join-item' type='submit'>
            generate tour
          </button>
        </div>
      </form>
      <div className='mt-16'>
        <div className='mt-16'>
          {tour ? <TourInfo tour={tour} tourImage={tourImage} /> : null}
        </div>
      </div>
    </>
  )
}
export default NewTour
