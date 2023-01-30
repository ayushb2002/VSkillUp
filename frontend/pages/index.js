import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
