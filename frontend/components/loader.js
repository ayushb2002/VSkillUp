import { Spinner } from "flowbite-react";
import { useState, useEffect } from "react";

export default function Loader()
{
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }, [])
    
    if(!isLoaded)
    {
      return (
      <section className='h-[100vh] flex justify-center items-center'>
          <Spinner
            color="pink"
            aria-label="Pink spinner example"
            size="xl"
          />
      </section>)
    }
}