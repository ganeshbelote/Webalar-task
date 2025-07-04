// let consider protected route of all assigned task to user A that can be accessed by that user by sending req to route GET /tasks
// but as access token going to expire in 15 min we have to aware of 401 Unauthorized error from middleware ensureAuth from backend

const baseUrl: string = 'http://localhost:5000'

const ensureAuth = async () => {
  const route = '/api/auth/v1/refresh'
  const finalUrl = `${baseUrl}${route}`

  try {
        const res = await fetch(finalUrl,{
            method : "GET",
            credentials: "include", 
        })
    
        const data = await res.json()

        if(data?.ok){
            localStorage.setItem("accessToken", data?.accessToken)
        }
        
        return data
    } catch (error) {
        console.log("Error :" + error)
        return `Error : ${error}`
    }
}

export default ensureAuth
