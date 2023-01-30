import Head from "next/head"
import { Button, TextInput, Label, Checkbox } from "flowbite-react"
import NavigationBar from "@/components/navbar"
import { useState } from "react"

export default function Register()
{

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const registerUser = (e) => {
        e.preventDefault();
        alert(name);
    }

    return (
        <>
        <Head>
            <title>VskillUp | Register</title>
        </Head>
        <NavigationBar />
        <section className="flex justify-center flex-col">
        <div className="w-100 text-center mt-10">
        <span className="text-3xl font-bold">Sign Up Form</span>
        </div>
        <div className="flex justify-center w-100">
        <form className="flex flex-col gap-4 lg:w-[25%] w-[75%] mt-20">
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="name1"
                    value="Your name"
                />
                </div>
                <TextInput
                id="name1"
                type="text"
                placeholder="John Doe"
                required={true}
                onChange={(e) => {setName(e.target.value)}}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="email1"
                    value="Your email"
                />
                </div>
                <TextInput
                id="email1"
                type="email"
                placeholder="name@mail.com"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label
                    htmlFor="password1"
                    value="Your password"
                />
                </div>
                <TextInput
                id="password1"
                type="password"
                required={true}
                onChange={(e) => setPwd(e.target.value)}
                />
            </div>
            <Button color="warning" className="w-[30%]" onClick={registerUser}>
                Sign Up
            </Button>
        </form>
        </div>
        </section>
        </>
    )
}