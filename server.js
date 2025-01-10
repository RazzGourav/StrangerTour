import {Server} from "socket.io";
import {initializeApp} from "firebase/app";
import {getDatabase, ref, set, get, query, orderByChild, equalTo} from "firebase/database";

const app = initializeApp({
	apiKey: "AIzaSyC7aGuyAU7FunBBzui6-ylx7Vhnw5DQEXc",
	authDomain: "codeonweb3.firebaseapp.com",
 	databaseURL: "https://codeonweb3-default-rtdb.firebaseio.com",
	projectId: "codeonweb3",
	storageBucket: "codeonweb3.appspot.com",
	messagingSenderId: "806306885018",
	appId: "1:806306885018:web:cde0d0f2c4b084b7e31e23"
});

const db = getDatabase(app);

const io = new Server({
	cors: {
		origin: "*"
	}
});

const getID = () => Math.random().toString(36).substr(2, 9);

io.on("connect", (socket) => {
	console.log("Connected...");

	socket.on("newUser", (data) => {
	    const usersRef = ref(db, 'users');
	    
	    get(usersRef).then((snapshot) => {
	        if (!snapshot.exists()) {
	            const id = getID();
	            set(ref(db, `users/${id}`), data).then(() => {
	                socket.emit("newUser", id);
	            });
	        } else {
	            const nameQuery = query(usersRef, orderByChild('name'), equalTo(data.name));
	            const contactQuery = query(usersRef, orderByChild('contact'), equalTo(data.contact));

	            get(nameQuery).then((snapshot) => {
	                if (snapshot.exists()) {
	                    socket.emit("userExists");
	                } else {
	                    get(contactQuery).then((snapshot) => {
	                        if (snapshot.exists()) {
	                            socket.emit("userExists");
	                        }
	                        else{
	                            const id = getID();

	                            set(ref(db, `users/${id}`), data).then(() => {
	                                socket.emit("newUser", id);
	                            });
	                        }
	                    });
	                }
	            });
	        }
	    });
	});

	socket.on("signIn", (data) => {
		get(ref(db, `users/${data.userId}`)).then((value) => {
			if (value.exists()){
				const dataValue = value.val();

				if (dataValue.password === data.password){
					socket.emit("signIn");
				}
				else{
					socket.emit("notSignIn");
				}
			}
			else{
				socket.emit("notSignIn");
			}
		});
	});

	socket.on("disconnect", () => {
		console.log("Disconnected...");
	});
});

io.listen(3000);