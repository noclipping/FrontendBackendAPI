let paragraph = document.querySelector('#form')
let token = ''

function getCookie(cname) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

paragraph.addEventListener('click', (e) => {
    fetch('http://localhost:5000/api', {
        method: 'GET',
    }).then((res) => {
        if (res.ok) {
            res.json().then((data) => {
                paragraph.textContent = JSON.stringify(data)
            })
        } else {
            console.log('not successful')
        }
    })
})

let submitBtn = document.querySelector('#submitBtn')

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = new FormData(document.querySelector('form'))
    console.log(formData.get('name'))

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
        }),
    }).then((res) => {
        res.json().then((data) => {
            console.log(data.token)
            token = `Bearer ${data.token}`
            document.cookie = `token=${token}`
        })
    })
})

let infoParagraph = document.querySelector('#displayInfo')

let getInfoBtn = document.querySelector('#getInfo')
getInfoBtn.addEventListener('click', (e) => {
    fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: getCookie('token'),
        },
        body: JSON.stringify({}),
    }).then((res) => {
        res.json().then((data) => {
            infoParagraph.innerHTML = ''
            console.log(data)

            console.log(Object.entries(data))
            for (const [key, value] of Object.entries(data.authData)) {
                if (key === 'user') {
                    console.log('=============================')
                    for (const [key2, value2] of Object.entries(value)) {
                        console.log(`${key2}: ${value2}`)
                        infoParagraph.innerHTML += `${key2}: ${value2} <br/>`
                    }
                    console.log('=============================')
                    continue
                }
                console.log(`${key}: ${value}`)
            }
        })
    })
})
