export async function getPersonData(slackId: string, email: string){
    const data = await fetch("https://slack.com/api/users.lookupByEmail",
        {
            headers: {
                Authorization: "Bearer " + process.env.SLACK_API_TOKEN
            },
            body: JSON.stringify({
                email: email
            })
        }
    )
}