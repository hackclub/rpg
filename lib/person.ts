export async function getPersonData(email: string){
    const data = await fetch(`https://slack.com/api/users.lookupByEmail?email=${email}`,
        { 
            method: "POST",
            headers: {
                Authorization: "Bearer " + process.env.SLACK_API_TOKEN
            }
        }
    ).then(r=>r.json())
    const display_name = data["user"]["profile"]["display_name_normalized"]
    const real_name = data["user"]["profile"]["real_name"]
    return { display_name, real_name }
}