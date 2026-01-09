import React from 'react'
import { assets } from '../assets/assets'

function Description() {
  return (
    <div className='flex flex-col items-center justify-center my-24 p-6 md:px-28'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Create AI Images</h1>
      <p className='text-gray-600 mb-8'>Turn your imagination into visuals</p>

      <div className='flex flex-col md:flex-row gap-8 items-center'>
  
        <img src={assets.sample_img_1} alt="" className='w-80 xl:w-96 rounded-lg'/>

       
        <div className='md:max-w-xl'>
          <h2 className='text-2xl font-semibold mb-4'>Introducing the AI-Powered Text to Image Generator</h2>
          <p className='mb-4'>
            Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images in just a few clicks. Imagine it, describe it, and watch it come to life instantly.
          </p>
          <p>
            Just type a text prompt, and our cutting-edge AI will create stunning, high-quality images in seconds. From product visuals and character designs to portraits—even concepts that don’t exist yet—can be brought to life effortlessly. Powered by advanced AI technology, the creative possibilities are endless!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Description
