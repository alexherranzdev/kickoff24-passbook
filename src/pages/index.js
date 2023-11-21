import {useCallback, useEffect, useRef, useState} from 'react'
import {GET_API_URI} from '@/constants.js'
import Webcam from 'react-webcam'
import CameraIcon from '@/icons/camera'

export default function Home() {
  const [email, setEmail] = useState('')
  const [account, setAccount] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageSent, setIsImageSent] = useState(false)
  const [facingMode, setFacingMode] = useState('user')
  const [deviceId, setDeviceId] = useState({})
  const [devices, setDevices] = useState([])
  const [photo, setPhoto] = useState(null)

  const emailRef = useRef(null)
  const webcamRef = useRef(null)

  const handleDevices = useCallback((mediaDevices) => setDevices(mediaDevices.filter(({kind}) => kind === 'videoinput')), [setDevices])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
    if (!deviceId) {
      setDeviceId(devices[0].deviceId)
    }
  }, [handleDevices])

  const checkEmailExists = async (email) => {
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch(GET_API_URI + 'check-email', {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al validar el email')
      }

      return response.json()
    } else {
      return {
        exists: true,
        account: {
          id: 116,
          fullname: 'Alex Herranz',
          firstname: 'Alex',
          lastname: 'Herranz'
        }
      }
    }
  }

  const handleSubmitImage = () => {
    if (process.env.NODE_ENV === 'development') {
      setIsImageSent(true)
      return
    }

    setIsSubmitting(true)
    setIsImageSent(false)

    const formData = new FormData()
    formData.append('image', photo)

    fetch(`${GET_API_URI}account/${account.id}/photo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al enviar la foto')
        }

        return response.json()
      })
      .then((data) => {
        setIsImageSent(true)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const handleSwitchCamera = () => {
    if (facingMode === 'user') {
      setFacingMode('environment')
    } else {
      setFacingMode('user')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)

    checkEmailExists(email)
      .then(({account}) => {
        setAccount(account)
      })
      .catch((error) => {
        emailRef.current.focus()
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const capture = useCallback(() => {
    setPhoto(webcamRef.current.getScreenshot())
  }, [webcamRef])

  return (
    <main className={`flex min-h-screen flex-col items-center p-12 justify-center`}>
      <header className='mt-20 mb-16'>
        <img src='/logo.png' alt='Winning Together' width={335} height={305} />
      </header>

      {!account.id && (
        <form method='POST' className='flex flex-col gap-y-6' onSubmit={handleSubmit}>
          <div className='flex flex-col text-center gap-y-6'>
            <label htmlFor='email' className='text-5xl font-bold uppercase text-primary'>
              Escribe tu email
            </label>
            <input type='email' ref={emailRef} onInput={(event) => setEmail(event.target.value)} name='email' id='email' placeholder='correo.electronico@danone.com' className='h-20 px-4 text-2xl text-center border-2 border-solid rounded-lg border-primary-dark' />
          </div>
          <button disabled={isSubmitting} type='submit' className='h-20 text-3xl min-w-[580px] font-bold text-center text-white uppercase transition-all duration-300 rounded-lg bg-primary hover:bg-primary-dark focus:bg-primary-dark disabled:opacity-60'>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}

      {account.id && !isImageSent && (
        <>
          <h3 className='mb-12 text-5xl font-bold uppercase text-primary'>¡Hola {account.firstname}!</h3>
          <div className='aspect-[9/16] relative w-[512px] h-[910px]'>
            <Webcam
              ref={webcamRef}
              audio={false}
              className='h-full'
              screenshotFormat='image/jpeg'
              videoConstraints={{
                width: 512,
                height: 910,
                facingMode: facingMode,
                deviceId
              }}
            />
            <div className='absolute h-full top-3 left-3'>
              <button onClick={handleSwitchCamera} className='block'>
                <CameraIcon />
              </button>
            </div>
            {!photo && (
              <button onClick={capture} className='block h-20 px-20 mx-auto mt-4 text-3xl font-bold text-center text-white uppercase transition-all duration-300 rounded-lg bg-primary hover:bg-primary-dark focus:bg-primary-dark disabled:opacity-60'>
                Hacer foto
              </button>
            )}

            {photo && (
              <button disabled={isSubmitting} onClick={handleSubmitImage} className='block h-20 px-20 mx-auto mt-4 text-3xl font-bold text-center text-white uppercase transition-all duration-300 rounded-lg bg-primary hover:bg-primary-dark focus:bg-primary-dark disabled:opacity-60'>
                {isSubmitting ? 'Enviado...' : 'Enviar'}
              </button>
            )}
          </div>
        </>
      )}

      {isImageSent && (
        <>
          <h3 className='max-w-lg mx-auto mb-12 text-5xl font-bold text-center text-primary'>Hemos enviado tu passbook a tu correo</h3>
          <button onClick={() => location.reload()} className='block h-20 px-20 mx-auto mt-4 text-3xl font-bold text-center text-white uppercase transition-all duration-300 bg-primary rounded-lg min-w-[580px] hover:bg-primary-dark focus:bg-primary-dark disabled:opacity-60'>
            Volver
          </button>
        </>
      )}

      <footer className='flex items-center justify-center mt-auto'>
        <img src='/logo-danone.png' alt='Danone' width={147} height={44} />
      </footer>
    </main>
  )
}
