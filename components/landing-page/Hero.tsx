import Image from 'next/image'
import logo from '@/public/landing-page/assets/Logo.png'
import heroCurve from '@/public/landing-page/assets/Hero-curve.png'
import heroKeyboard from '@/public/landing-page/assets/Hero-Keyboard.png'
import heroDown from '@/public/landing-page/assets/Hero-down.png'

export default function Hero() {
    return (
        <section className='pt-20'>
            <section className='hidden xl:block px-20 py-16 flex justify-center items-center'>
                <div className='px-20 bg-[#353433] rounded-[46px] flex'>
                <div className='w-2/3'>
                    <div className=' py-32 relative flex justify-between'> 
                        <div className='relative'>
                            <Image 
                                src={heroCurve}
                                alt="HeroCurve"
                                width={445}
                                height={230}
                                className='hidden xl:block'
                            />
                            <h1 className='absolute top-10 left-10 right-0 text-black text-roboto text-[100pt] color-orange text-right'>CatMod</h1>
                        </div>
                        <Image 
                            src={heroKeyboard}
                            alt="Hero Keyboard"
                            width={197}
                            height={160}
                            className='hidden xl:block py-32 absolute top-0 right-0'
                        />
                    </div>

                    <div className='relative py-[-100px]'>
                        <p className='px-11 -mt-36 text-white text-[20px]'>Create powerful digital solutions effortlessly with our AI-powered Low-Code/No-Code platform-no coding required. Transform your ideas into reality quickly, efficiently, and intuitively, all in one unified platform.</p>
                    </div>

                    <div className='px-72 pt-20'>
                        <Image 
                            src={heroDown}
                            alt="Hero Down"
                            width={300}
                            height={200}
                            className='hidden 2xl:block'
                        />
                    </div>
                </div>
                
                <div className='pt-44 w-1/3 text-Mulish text-[30px] flex justify-end mb-10 2xl:mb-20'>
                    <Image 
                        src={logo}
                        alt="Logo"
                        width={400}
                        height={400}
                        className='block w-[400px] h-[400px] xl:mt-0 mt-10'
                    />
                    </div>
                </div>
            </section>

            <section className='block xl:hidden px-4 md:px-10 lg:px-20 py-8 md:py-16 flex justify-center items-center'>
                <div className='px-4 md:px-10 lg:px-20 bg-[#353433] rounded-[46px] flex flex-col items-center'>
                    <div className='py-16 relative flex flex-col items-center'>
                        <Image 
                            src={logo}
                            alt="Logo"
                            width={300}
                            height={300}
                            className='block w-[300px] h-[300px] mb-4'
                        />
                        <h1 className='text-black text-roboto text-[30px] color-orange text-center'>CatMod</h1>
                        <p className='px-4 text-[20px] text-white text-center'>Create powerful digital solutions effortlessly with our AI-powered Low-Code/No-Code platform-no coding required. Transform your ideas into reality quickly, efficiently, and intuitively, all in one unified platform.</p>
                    </div>
                </div>
            </section>
        </section>
    );
}