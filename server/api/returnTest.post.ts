import { FetchError } from 'ofetch';
import { H3Event } from 'h3';

// #region interfaces
export interface APIExampleParams {
    username: string;
}

export interface GitHubProfile {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                string;
    user_view_type:      string;
    site_admin:          boolean;
    name:                string;
    company?:            string;
    blog:                string;
    location:            string;
    email?:              string;
    hireable?:           string;
    bio?:                string;
    twitter_username?:   string;
    public_repos:        number;
    public_gists:        number;
    followers:           number;
    following:           number;
    created_at:          Date;
    updated_at:          Date;
}
// #endregion

export default defineEventHandler(async (event: H3Event) => {

    // read the body from the event with the build in method
    const body: APIExampleParams = await readBody(event);

    // private variables can be brought in from the runtime config
    const variables = useRuntimeConfig().private.privateVariable;

    console.log('Here is the body passed to /api/returnTest: ', body);
    console.log('Here are the variables brought in from the private runtimeConfig: ', variables);
    
    if (!body.username || body.username === "") {
        // H3 Errors can be returned with the createError method
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: 'You must provide an username',
            data: {
                field: "username"
            }
        })
    };

    async function getGithubProfile(username: string): Promise<GitHubProfile | null> {
        const url = new URL(`https://api.github.com/users/${username}`);
        const headers = {
            Accept: 'application/json',
        };

        try {
            const data: GitHubProfile = await $fetch(url.toString(), {
                method: 'GET',
                headers
            });

            if (data.id) {
                return data;
            } else return null;
        } catch (error) {
            // if the error is a fetch error just pass it along.
            if (error instanceof FetchError) {
                throw createError({ ...error });
            }
            // if the error is NOT a fetch error, it's unknown so we just throw a 500.
            else {
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Internal Server Error',
                    message: 'Unable to search for github profile, an unknown error occured'
                });
            };
        };
    };

    // API runs here
    try {
        const profile: GitHubProfile | null = await getGithubProfile(body.username);

        // you can set the response status, but for a 200 this is not necessary.
        setResponseStatus(event, 200);

        return profile;

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});