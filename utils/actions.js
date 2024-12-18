'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a helpful assistant' },
        ...chatMessages,
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    })

    return {
      message: response.choices[0].message,
      tokens: response.usage.total_tokens,
    }
  } catch (error) {
    return null
  }
}

export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a ${city} in this ${country}.
If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country}. 
Once you have a list, create a one-day tour. Response should be in the following JSON format: 
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "description of the city and tour",
    "stops": ["short paragraph on the stop 1 "]
  }
}
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return { "tour": null }, with no additional characters.`

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a tour guide' },
        { role: 'user', content: query },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0,
    })
    const tourData = JSON.parse(response.choices[0].message.content)

    if (!tourData.tour) {
      return null
    }

    return { tour: tourData.tour, tokens: response.usage.total_tokens }
  } catch (error) {
    console.log(error)

    return null
  }
}

export const generateTourImage = async ({ city, country }) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `a panoramic view of the ${city} ${country}`,
      n: 1,
      size: '512x512',
    })
    console.log(tourImage?.data[0]?.url)

    return tourImage?.data[0]?.url
  } catch (error) {
    return null
  }
}
