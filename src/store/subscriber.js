import store from "@/store"

store.subscribe((mutation) => {
  switch (mutation.type) {
    case 'auth/SET_TOKEN':
      if (mutation.payload) {
        localStorage.setItem('token', mutation.payload)
      } else {
        localStorage.removeItem('token')
      }
      break;

    case 'auth/SET_USER':
      if (mutation.payload) {
        localStorage.setItem('user', mutation.payload)
        
        localStorage.setItem('name', mutation.payload.name)
        localStorage.setItem('surname', mutation.payload.surname)
        localStorage.setItem('email', mutation.payload.email)
        localStorage.setItem('isAdmin', mutation.payload.isAdmin)
      } else {
        localStorage.removeItem('user')
        
        localStorage.removeItem('name')
        localStorage.removeItem('surname')
        localStorage.removeItem('email')
        localStorage.removeItem('isAdmin')
      }
      break;
  }
})


