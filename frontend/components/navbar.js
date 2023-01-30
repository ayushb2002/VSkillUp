import { Dropdown, Avatar, Navbar } from "flowbite-react"
import Loader from "./loader"

export default function NavigationBar() 
{
    return (
        <>
        <Loader />
        <Navbar
            fluid={true}
            rounded={true}
        >
        <Navbar.Brand href="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            VskillUp
            </span>
        </Navbar.Brand>
        <div className="flex md:order-2 hidden">
            <Dropdown
            arrowIcon={false}
            inline={true}
            label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded={true}/>}
            >
            <Dropdown.Header>
                <span className="block text-sm">
                Welcome John Doe
                </span>
                <span className="block truncate text-sm font-medium">
                name@mail.com
                </span>
            </Dropdown.Header>
            <Dropdown.Item>
                Dashboard
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
                Sign out
            </Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link
            href="/">
            Home
            </Navbar.Link>
            <Navbar.Link href="/learn">
            Learn
            </Navbar.Link>
            <Navbar.Link href="/dailyChallenge">
            Daily Challenge
            </Navbar.Link>
            <Navbar.Link href="/leaderboard">
            Leaderboard
            </Navbar.Link>
            <Navbar.Link href="/login">
            Login
            </Navbar.Link>
            <Navbar.Link href="/register">
            Register
            </Navbar.Link>
        </Navbar.Collapse>
        </Navbar>
        </>
    )
}