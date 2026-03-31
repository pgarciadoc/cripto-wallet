async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const registerPost = {
        email: email,
        password: password
    };

    console.log('Email:', email);
    console.log('Password:', password);

    try {
        const response = await fetch("http://localhost:3000/auth/register",
            {   method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerPost)
            });

        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        message.innerText = 'Conta criada com sucesso!';
        message.style.color = 'green';

        console.log(result);
    }catch (error){
        message.innerText = error.message;
        message.style.color = 'red';
    }
}




async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    const loginPost = {
        email: email,
        password: password
    };

    console.log('Email:', email);
    console.log('Password:', password);

    try {
        const response = await fetch("http://localhost:3000/auth/login",
            {   method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginPost)
            });

        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
    }catch (error){
        console.error(error.message);
    }
}