import Image from 'next/image'

const TourInfo = ({ tour, tourImage }) => {
  const { title, description, stops } = tour

  return (
    <div className='max-w-2xl'>
      <h1 className='text-4xl font-semibold mb-4'>{title}</h1>

      <p className='leading-loose mb-6'>{description}</p>
      <ul>
        {stops.map((stop) => {
          return (
            <li key={stop} className='mb-4 bg-base-100 p-4 rounded-xl'>
              <p className='text'>{stop}</p>
            </li>
          )
        })}
      </ul>
      {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className='rounded-xl shadow-xl mb-16 h-48 w-96 object-cover'
            alt={tour.title}
            priority
          />
        </div>
      ) : null}
    </div>
  )
}
export default TourInfo
