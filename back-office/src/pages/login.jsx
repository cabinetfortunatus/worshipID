import {useState} from 'react'
import { Authentication } from '../auth/auth';
import church from '../assets/churchLottie.json'
import { Player } from '@lottiefiles/react-lottie-player'
import cloud from '../assets/images/cloud.png'
import {Axios} from '../api/axios'
import { PulseLoader } from 'react-spinners';
function Login(){
const [username, setUsername] = useState('')
const [showpass, setShowpass] = useState(false)
const [password, setPassword] = useState('')
const axios = Axios()
const [isLogLoading, setisLogLoading] = useState(false)
const {DoLogin, error_msg} = Authentication()

const handleSubmit = async (e) =>{
    e.preventDefault()
    alert('test') 
}
const handleLogin = async (e) => {
    e.preventDefault();
    setisLogLoading(true)
    await DoLogin(username, password).finally(() => {setisLogLoading(false)})
    
  }
  
const buttonShowPass = () => {
    setShowpass(!showpass)
}


return(<>
    <div className='relative flex flex-col md:flex-1 items-center justify-center w-full min-h-screen bg-gradient-to-b from-white to-blue-400'>
        <div className='flex md:hidden w-40 h-40 mx-auto'>
            <Player src={church} className="player" loop autoplay />
        </div>
        <div className='relative z-40 grid md:grid-cols-[60%_40%] justify-center items-center  w-[80%] md:w-[50%] h-auto rounded-2xl 
        shadow-2xl'>
            <div className='relative flex flex-col w-full h-full bg-transparent rounded-tl-xl rounded-bl-xl'>
                {/* <div className='absolute bg-gray-200 opacity-50 -z-10  w-full h-full blur-sm' ></div> */}
                <h1 className='mb-4 mt-4 font-bold text-2xl text-[#07A889] ml-4'>Se connecter</h1>
                <h1 className='w-full text-center my-2'>Bienvenue sur <span className='font-semibold text-lg'>WorshipID</span> !</h1>
                <p className='text-sm px-4'>
                    Nous sommes ravis de vous accueillir sur notre plateforme dédiée à la gestion des présences dans votre église grâce à la technologie de reconnaissance faciale. WorshipID simplifie et sécurise l'enregistrement des participants à vos services religieux, en offrant une solution rapide et moderne.
                </p>
                <form className='relative flex flex-col items-center justify-center mx-4 mt-8' onSubmit={handleSubmit} >
                    <div className="relative z-0 w-full mb-5 group">
                        <input onChange={(e)=> { setUsername(e.target.value) }} value={username} type="text" name="floating_username" id="floating_username" maxLength={20} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-b-2 border-gray-500 appearance-none    focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " required />
                        <label  className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-900  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nom d'utilisateur</label>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-1">
                        <svg width= "20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path opacity="0.7" fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                        </span>

                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                      <input onChange={(e)=> { setPassword(e.target.value) }} value={password} type={showpass ? 'text' : 'password'} name="floating_password" id="floating_password" maxLength={20} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none    focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " required />
                      <label  className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mot de passe</label>
                        <button onClick={buttonShowPass} type='button'>
                            { showpass ? (
                                <span  className="absolute inset-y-0 right-0 flex items-center pr-1 pb-2">
                                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path opacity="0.7"  fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                </svg>
                                </span>
                            
                            ):(
                            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pb-2">
                                <svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path opacity="0.7" d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                <path opacity="0.7" d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                <path opacity="0.7" d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                </svg>
                            </span>

                            )
                            }
                        </button>
                    </div>
                    <div className='w-full my-4 text-sm flex items-center text-red-600 justify-center'>{error_msg}</div>
                    <button className='rounded-md bg-blue-500 px-4 py-2 w-32 mb-4 text-white font-semibold' onClick={handleLogin}>{isLogLoading ? (<PulseLoader size={10} color='#fff' />):'Se connecter' }</button>
                    <a download href="/WorshipID_MobileApp.apk" className="flex w-full justify-center items-center text-sm gap-2 font-semibold text-gray-800 my-2 hover:underline" >
                        Télécharger la version mobile ici
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 32 32"><rect width={4} height={10} x={2} y={12} fill="#07A889" rx={2}></rect><rect width={4} height={10} x={26} y={12} fill="#07A889" rx={2}></rect><path fill="#07A889" d="M8 12h16v12H8zm2 12h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm8 0h4v4a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm3.545-19.759l2.12-2.12A1 1 0 0 0 22.251.707l-2.326 2.326a7.97 7.97 0 0 0-7.85 0L9.75.707a1 1 0 1 0-1.414 1.414l2.12 2.12A7.97 7.97 0 0 0 8 10h16a7.97 7.97 0 0 0-2.455-5.759M14 8h-2V6h2Zm6 0h-2V6h2Z"></path></svg>
                    </a>
                </form>
            </div>
            <div className='hidden md:flex items-center justify-center bg-white w-full h-full rounded-tr-xl rounded-br-xl'>
                <Player src={church} className="player" loop autoplay />
            </div>
        </div>
        <img className='absolute  bottom-0 w-full h-48 md:h-[40rem] xl:h-[50rem] opacity-50' src={cloud} />
    </div>
 

</>)
}

export default Login;
