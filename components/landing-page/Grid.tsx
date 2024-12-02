import Image from 'next/image'
import roombooking from '@/public/landing-page/assets/Grid/roombooking.webp'
import personal from '@/public/landing-page/assets/Grid/personal.jpg'
import community from '@/public/landing-page/assets/Grid/community.webp'
import honey from '@/public/landing-page/assets/Grid/Honey.jpg'
import socialmedia from '@/public/landing-page/assets/Grid/socialmedia.jpg'
import educational from '@/public/landing-page/assets/Grid/educational.jpg'


function Test() {
    return (
        <>
            <h1 className='text-4xl font-bold color-orange text-center mt-10 mb-5'>Catmod in Action</h1>
            <section className='h-[600px] w-full flex justify-center items-center'>
                <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 px-10">
       
                    <div className="col-span-1 row-span-2 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={roombooking}
                                alt="Room Booking"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            E-Booking
                        </h1>
                    </div>

                    <div className="col-span-2 row-span-1 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={personal}
                                alt="Personal"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Portfolio
                        </h1>
                    </div>
                    <div className="col-span-1 row-span-2 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={community}
                                alt="Community"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Community
                        </h1>
                    </div>
                    <div className="col-span-2 row-span-1 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={honey}
                                alt="Honey"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Ecommerce
                        </h1>
                    </div>
                    <div className="col-span-2 row-span-1 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={socialmedia}
                                alt="Social Media"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Social Media
                        </h1>
                    </div>
                    <div className="col-span-2 row-span-1 transition-all duration-300 relative group">
                        <span className="textopp hover:opacity-10 transition-all duration-300">
                            <Image 
                                src={educational}
                                alt="Educational"
                                width={500}
                                height={300}
                                className="rounded-sm w-full h-full object-cover"
                            />
                        </span>
                        <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white color-orange-image opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            E-Learn
                        </h1>
                    </div>
                </div>
            </section >
        </>
    )
}

export default Test;