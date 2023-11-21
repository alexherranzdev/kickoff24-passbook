import {useRef, useState} from 'react'
import {GET_API_URI} from '@/constats.js'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)

  const emailRef = useRef(null)

  const checkEmailExists = async (email) => {
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
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)

    checkEmailExists(email)
      .then(() => {
        setIsEmailValid(true)
      })
      .catch((error) => {
        setIsEmailValid(false)
        emailRef.current.focus()
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <main className={`flex min-h-screen flex-col items-center p-24 justify-center`}>
      <header className='mt-20 mb-16'>
        <img src='/logo.png' alt='Winning Together' width={335} height={305} />
      </header>

      {!isEmailValid && (
        <form method='POST' className='flex flex-col gap-y-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-y-6'>
            <label htmlFor='email' className='text-5xl font-bold uppercase text-primary'>
              Escribe tu email
            </label>
            <input type='email' ref={emailRef} onInput={(event) => setEmail(event.target.value)} name='email' id='email' placeholder='correo.electronico@danone.com' className='h-20 px-4 text-2xl text-center border-2 border-solid border-primary-dark rounded-xl' />
          </div>
          <button disabled={isSubmitting} type='submit' className='h-20 text-3xl font-bold text-center text-white uppercase transition-all duration-300 bg-primary rounded-xl hover:bg-primary-dark focus:bg-primary-dark disabled:opacity-60'>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}

      <footer className='flex items-center justify-center mt-auto'>
        <img src='/logo-danone.png' alt='Danone' width={147} height={44} />
      </footer>
    </main>
  )
}
