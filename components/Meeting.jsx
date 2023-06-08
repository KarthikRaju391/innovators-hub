import { useEffect } from "react";
import { useRouter } from "next/router";

const Meeting = () => {
	const router = useRouter();
	useEffect(() => {
		return async () => {
			return new Promise(async (resolve, reject) => {
				const ZoomEmbed = await (
					await import("@zoomus/websdk/embedded")
				).default;

				resolve(ZoomEmbed.createClient());
			})
				.then(async (client) => {
					let meetingSDKElement = document.getElementById("meetingSDKElement");

					client.init({
						language: "en-US",
						zoomAppRoot: meetingSDKElement,
					});

					let payload = router.query;

					const { data } = await fetch("/api/zoom/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payload),
					})
						.then((res) => res.json())
						.catch((error) => {
							console.log("signature request error", error);
						});

					client.join({
						meetingNumber: payload.meetingNumber,
						signature: data.signature,
						sdkKey: data.sdkKey,
						userName: payload.userName,
						tk: "",
					});
				})
				.catch((error) => {
					console.log("error inside useEffect", error);
				});
		};
	});
	return (
		<div className="h-1/2 w-1/2 mt-5 flex">
			<div className="w-1/4" id="meetingSDKElement"></div>
			<div className="w-3/4">Content</div>
		</div>
	);
};

Meeting.displayName = "Zoom Component View";

export default Meeting;
