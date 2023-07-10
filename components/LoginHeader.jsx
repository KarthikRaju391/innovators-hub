import * as React from "react";
import {
	HeaderNavigation,
	ALIGN,
	StyledNavigationList,
	StyledNavigationItem,
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import { TiThMenu } from "react-icons/ti";
import SideNavUser from "../components/SideNav/SideNavUser";
import classes from "../styles/header.module.css";
import { useSession } from "next-auth/react";
import SideNavPostalAdmin from "./SideNav/SideNavPostalAdmin";
import { useRouter } from "next/router";

function LoginHeader() {
	const { data: session } = useSession();
	const router = useRouter();
	// console.log(session.data)
	const user = session?.user.name || "";

	const role = session?.user.role; //"user" or "investor" or "entrepreneur" or JUST "admin"

	const [isOpen, setIsOpen] = React.useState(false);

	var handleOpen = () => {
		setIsOpen(false);
	};

	var openDraw = () => {
		setIsOpen(true);
	};

	if(!session) {
		return null;
	}

	return (
		<>
			{role?.includes("USER") && (
				<SideNavUser open={isOpen} handleOpen={handleOpen} />
			)}
			{role?.includes("ADMIN") && (
				<SideNavPostalAdmin open={isOpen} handleOpen={handleOpen} />
			)}
			<HeaderNavigation className={classes.uls} style={{ borderRadius: "0" }}>
				<StyledNavigationList $align={ALIGN.left}>
					<StyledNavigationItem>
						<StyledLink
							style={{
								fontSize: "1.5rem",
								textDecoration: "none",
								fontFamily: "Syncopate",
								fontWeight: "550",
								userSelect: "none",
								cursor: "pointer",
							}}
							onClick={() => router.push("/")}
						>
							Innovators' Hub
						</StyledLink>
					</StyledNavigationItem>
				</StyledNavigationList>
				<StyledNavigationList $align={ALIGN.center}>
					<StyledNavigationItem>
						<StyledLink
							style={{ cursor: "pointer" }}
							onClick={() => router.push("/user/meetings")}
						>
							<div className="flex">
								{user}
								{session.user.meetings && <div className="bg-red-600 rounded-full h-2 w-2" />}
							</div>
						</StyledLink>
					</StyledNavigationItem>
				</StyledNavigationList>
				<StyledNavigationList $align={ALIGN.right}>
					<StyledNavigationItem>
						<StyledLink>
							<TiThMenu
								style={{ marginRight: "1rem", fontSize: "1.2rem" }}
								title="Menu"
								onClick={() => openDraw()}
							/>
						</StyledLink>
					</StyledNavigationItem>
				</StyledNavigationList>
			</HeaderNavigation>
		</>
	);
}

export default LoginHeader;
