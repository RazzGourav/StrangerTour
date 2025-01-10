import "./lib/socket.io.min.js";
import "./lib/swal.js";

const swal = window.Sweetalert2;

const socket = io("http://localhost:3000");

const frame = document.querySelector("#frame");

let frameDocument;

frame.addEventListener("load", () => {
	frameDocument = frame.contentWindow.document;

	if (frame.contentWindow.location.href.includes("sign.html")){
	    const signButton = frameDocument.getElementById('signButton');

	    signButton.addEventListener("click", () => {
	        const idInput = frameDocument.getElementById('idInput').value;
	        const passwordInput = frameDocument.getElementById('passwordInput').value;

	        if (!idInput || !passwordInput) {
	            swal.fire({
	                icon: 'error',
	                title: 'Validation Failed',
	                text: 'Please enter both ID and password.',
	                toast: true,
	                position: 'top-end',
	                timer: 3000,
	                showConfirmButton: false
	            });
	            return;
	        }

	        socket.emit("signIn", {
	            userId: idInput,
	            password: passwordInput
	        });
	    });

	    socket.on("signIn", () => {
	        swal.fire({
	            icon: 'success',
	            title: 'Sign-In Successful',
	            text: 'Welcome back!',
	            toast: true,
	            position: 'top-end',
	            timer: 3000,
	            showConfirmButton: false
	        });
	    });

	    socket.on("notSignIn", () => {
	        swal.fire({
	            icon: 'error',
	            title: 'Sign-In Failed',
	            text: 'Invalid ID or password.',
	            toast: true,
	            position: 'top-end',
	            timer: 3000,
	            showConfirmButton: false
	        });
	    });
	}

	if (frame.contentWindow.location.href.includes("signup.html")){
	    const signButton = frameDocument.getElementById('signButton');

        signButton.addEventListener("click", () => {
	        const firstName = frameDocument.getElementById('firstName').value;
	        const lastName = frameDocument.getElementById('lastName').value;
	        const dobDay = frameDocument.getElementById('dobDay').value;
	        const dobMonth = frameDocument.getElementById('dobMonth').value;
	        const dobYear = frameDocument.getElementById('dobYear').value;
	        const genderValue = frameDocument.querySelector('input[name="gender"]:checked')?.value;
	        const emailPhoneNumber = frameDocument.getElementById('emailPhoneNumber').value;
	        const newPassword = frameDocument.getElementById('newPassword').value;

	        if (!firstName || !lastName || !dobDay || !dobMonth || !dobYear || !genderValue || !emailPhoneNumber || !newPassword) {
	            swal.fire({
	                icon: 'error',
	                title: 'Validation Failed',
	                text: 'Please fill in all fields.',
	                toast: true,
	                position: 'top-end',
	                timer: 3000,
	                showConfirmButton: false
	            });
	            return;
	        }

	        if (newPassword.length < 8) {
	            swal.fire({
	                icon: 'error',
	                title: 'Password Error',
	                text: 'Password must be at least 8 characters long.',
	                toast: true,
	                position: 'top-end',
	                timer: 3000,
	                showConfirmButton: false
	            });
	            return;
	        }

	        const fullName = `${firstName} ${lastName}`;
	        const fullDateOfBirth = `${dobDay} ${dobMonth} ${dobYear}`;

	        socket.emit("newUser", {
	            name: fullName,
	            dob: fullDateOfBirth,
	            gender: genderValue,
	            contact: emailPhoneNumber,
	            password: newPassword
	        });

			socket.on("newUser", (id) => {
			    swal.fire({
			        icon: 'success',
			        title: 'Account Created Successfully',
			        html: `
			            <p>Your account ID is:</p>
			            <strong>${id}</strong>
			            <br>
			            <button id="copyIdButton" class="swal2-confirm swal2-styled" style="background-color: #3085d6; color: white;">
			                Copy ID
			            </button>
			        `,
			        showConfirmButton: false,
			        allowOutsideClick: false
			    });

			    setTimeout(() => {
			        const copyButton = document.getElementById('copyIdButton');
			        copyButton.addEventListener('click', () => {
			            navigator.clipboard.writeText(id).then(() => {
			                swal.fire({
			                    icon: 'success',
			                    title: 'Copied to Clipboard!',
			                    text: 'Your ID has been copied.',
			                    toast: true,
			                    position: 'top-end',
			                    timer: 2000,
			                    showConfirmButton: false
			                });
			            });
			        });
			    }, 100);
			});

	        socket.on("userExists", () => {
	            swal.fire({
	                icon: 'error',
	                title: 'User Exists',
	                text: 'A user with the same name or contact already exists.',
	                toast: true,
	                position: 'top-end',
	                timer: 3000,
	                showConfirmButton: false
	            });
	        });
        });
	}
});