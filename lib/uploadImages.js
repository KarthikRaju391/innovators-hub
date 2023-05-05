import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

export function uploadImages(files) {
	const fileNames = files.forEach((image) => {
		const fileName = new Date().getTime() + "-" + image.name;
		return fileName;
	});
	const storage = getStorage(app);
	const storageRef = ref(storage, "images/" + fileNames);
	const uploadTask = uploadBytesResumable(storageRef, files);
	// const uploadedImages = [];

	uploadTask.on(
		"state_changed",
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log("Upload is " + progress + "% done");
			switch (snapshot.state) {
				case "paused":
					console.log("Upload is paused");
					break;
				case "running":
					console.log("Upload is running");
					break;
			}
		},

		(error) => {
			console.log(error);
		},

		() => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log("File available at", downloadURL);
			});
		}
	);
}
