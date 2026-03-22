import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: ''
  })

  const signup = async () => {
    if (!form.username || !form.password) {
      alert('Fill all fields')
      return
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (data.success) {
      alert('Account created')
      router.push('/login')
    } else {
      alert(data.error)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Account</h2>

      <input placeholder="Username" onChange={e=>setForm(p=>({...p,username:e.target.value}))} />
      <br/><br/>
      <input placeholder="Name" onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
      <br/><br/>
      <input type="password" placeholder="Password" onChange={e=>setForm(p=>({...p,password:e.target.value}))} />
      <br/><br/>

      <button onClick={signup}>Create Account</button>
    </div>
  )
}
