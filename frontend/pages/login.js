import Head from "next/head"
import { Button, TextInput, Label, Checkbox, Avatar } from "flowbite-react"
import NavigationBar from "@/components/navbar"
import { useState } from "react"

export default function Login()
{
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const loginForm = (e) => {
        e.preventDefault();
        alert(email);
    }

    const googleLogin = (e) => {
        e.preventDefault();
        alert('google');
    }

    return (
        <>
        <Head>
            <title>VskillUp | Login</title>
        </Head>
        <NavigationBar />
        <section className="flex justify-center flex-col">
        <div className="w-100 text-center my-10">
        <span className="text-3xl font-bold">Sign In Form</span>
        </div>
        <div className="w-100 flex justify-center my-5">
            <div className="text-center border border-solid border-cyan-500 py-5 px-2 rounded flex flex-row hover:border-2" onClick={googleLogin}>
                <div className="flex justify-center">
                <Avatar alt="google" img="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" className="w-9 h-6" rounded={true} />
                </div>
                <div className="flex justify-end text-center mx-5 my-auto">
                    <span>Login With Google</span>
                </div>
            </div>
        </div>
        <div className="flex justify-center w-100">
        <form className="flex flex-col gap-4 lg:w-[25%] w-[75%]">
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
            <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">
                Remember me
                </Label>
            </div>
            <Button color="purple" className="w-[30%]" onClick={loginForm}>
                Submit
            </Button>
        </form>
        </div>
        </section>
        </>
    )
}