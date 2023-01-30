import Head from 'next/head'
import Cookies from 'js-cookie'
import NavigationBar from '@/components/navbar'

export default function Home() {

  return (
    <>
      <Head>
        <title>VskillUp</title>
      </Head>
      <section>
        <NavigationBar />
      </section>
    </>
  )

}
