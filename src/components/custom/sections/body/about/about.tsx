import React from 'react'

const AboutOurProject = () => {
  return (
    <div className='p-10'>
      <h2 className='font-semibold text-5xl mb-2'>About Our Project</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum,
        tortor eu posuere fermentum, neque nunc pellentesque felis, id tincidunt
        neque ipsum in velit. Donec at justo vel arcu gravida consectetur. Nulla
        facilisi. Sed vel velit auctor, bibendum neque non, efficitur ipsum. Donec
        tristique massa vel neque malesuada, at condimentum arcu gravida. Donec
        facilisis, nisi vel ultricies feugiat, dolor mauris semper eros, et
        ullamcorper velit neque at turpis.
      </p>

      <h3 className='font-semibold text-xl mt-8 mb-2'>Our Team</h3>
      <div className='grid grid-cols-3 gap-4'>
        <div className='shadow-md p-6 rounded-md'>
          <img
            src='https://via.placeholder.com/150'
            alt='Team Member'
            className='w-full h-32 object-cover rounded-md'
          />
          <h4 className='font-semibold text-lg mt-4'>John Doe</h4>
          <p className='text-gray-600'>Project Manager</p>
        </div>
        {/* Repeat for additional team members */}
      </div>

      <h3 className='font-semibold text-xl mt-8 mb-2'>Press Coverage</h3>
    </div>
  )
}

export default AboutOurProject