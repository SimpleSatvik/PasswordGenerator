import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")

  // useRef hook
  const passwordRef = useRef(null)
  /*
  Without useCallback, this happens:

Every render → a new passwordGenerator function is created
React thinks it's a different function every time, cuz we passed passwordGenerator()
in useEffect's parameters.


Function is only recreated when dependencies change (basically optimizes it)
(length, numberAllowed, charAllowed)
  */
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if (numberAllowed) str += "0123456789"

    if (charAllowed) str += "!#$%&()*+,-./:;<=>?@[\]^_`{|}~"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }

    setPassword(pass)
    //passing setPassword will keep this method in memory and optimize it
  }, [length, charAllowed, numberAllowed, setPassword])

  const copyPasswordToClipboard = useCallback(() => 
  {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
  }, [password])

  useEffect(() => 
  {
    /*
    useEffect() is run after the entire component is rendered.
    First the component will render, till this point password is ""
    After the componenet is fully rendered, useEffect will run and inside
    that, passwordGenerator() will run updating the password.

    The parameters we passed like length, numberAllowed etc are being
    watched over by react, and if any of this changes, the method is 
    called again.
    As we can see if we change the slider a little, it results in a new 
    random passowrd.
    */
    passwordGenerator()
    }, [length, numberAllowed, charAllowed, passwordGenerator])
  return (
    <>

      <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 my-8 text-orange-500 bg-gray-800'>
        <h1 className='text-4xl text-center my-3'>Password Generator</h1>
        <div className='flex shadow rounded-lg overflow-hidden mb-4 bg-white'>
          <input type="text" value={password} className='outline-none w-full 
      py-1 px-3' placeholder='password' readOnly ref={passwordRef} />
          <button className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'
          onClick={copyPasswordToClipboard}
          >copy</button>

        </div>

        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input type="range"  min={6} max={50} value={length} 
            className='cursor-pointer'
            onChange={(e) => {
              setLength(e.target.value)
            }}
            />
            <label>Length : {length}</label>
          </div>
          <div className='flex items-center gap-x-1'>
            <input type="checkbox"
            defaultChecked = {numberAllowed}
            id = 'numberInput'
            onChange={() => 
            {
              setNumberAllowed(prev => !prev)
            }
            } />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          
          <div className='flex items-center gap-x-1'>
            <input type="checkbox"
            defaultChecked = {charAllowed}
            id = 'charachterInput'
            onChange={() => 
            {
              setCharAllowed(prev => !prev)
            }
            } />
            <label htmlFor="charachterInput">Charachters</label>
          </div>
          
        </div>

      </div>

    </>
  )
}
/*
👉 We created a passwordGenerator() function that generates a password based on state.

👉 To run this function whenever length, numberAllowed, or charAllowed changes,
 we use useEffect().

👉 useEffect watches dependencies and re-runs when they change.

👉 We also include passwordGenerator in dependencies (best practice),
 because React expects all used values/functions to be listed.

 Problem:
On every render, a new passwordGenerator function is created
React compares dependencies → sees a new function
So useEffect runs again
Inside it, setPassword() triggers another render
🔁 This creates an infinite loop

✅ Solution:

We use useCallback():

This memoizes the function

If dependencies don’t change → same function reference
If dependencies change → new function is created
🎯 Result:
useEffect only runs when actual dependencies change
No unnecessary re-runs
Infinite loop is avoided
*/

export default App
