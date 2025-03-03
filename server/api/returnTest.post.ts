import { FetchError } from 'ofetch';
import { H3Event } from 'h3';
import type { APIExampleParams, GitHubProfile } from '~~/types';

export default defineEventHandler(async (event: H3Event) => {
    console.time('api-run');
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

    const timeConsumingBackgroundTask = async () => {
        console.timeLog('api-run', 'background task starting');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.timeLog('api-run', 'background task ended');
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
        // you can set a wait on a time consuming task. The API will return immediately but the instance will be kept alive until the process has finished.
        event.waitUntil(timeConsumingBackgroundTask());
        console.timeLog('api-run', 'returning data from the api before the background is finished');
        return profile;

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }
});