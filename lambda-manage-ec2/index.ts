import { EC2ServiceException } from '@aws-sdk/client-ec2';
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lambda';
import {
  APIChatInputApplicationCommandInteraction,
  InteractionResponseType,
  InteractionType,
  type APIInteraction,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponsePong,
} from 'discord-api-types/v10';
import { verify } from 'discord-verify/node';

const AWS_REGION = process.env.AWS_REGION;
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY;
const MINECRAFT_SERVER_URL = process.env.MINECRAFT_SERVER_URL;

if (!DISCORD_APP_PUBLIC_KEY) {
  throw new Error('Missing public key');
}

const buildResult = (
  statusCode: number,
  body: Record<string, unknown> = {}
) => {
  return {
    headers: { 'content-type': 'application/json' },
    statusCode,
    body: JSON.stringify(body),
  };
};

const validate = async (event: APIGatewayProxyEventV2) => {
  return verify(
    event.body,
    event.headers['x-signature-ed25519'],
    event.headers['x-signature-timestamp'],
    DISCORD_APP_PUBLIC_KEY,
    crypto.subtle
  );
};

const handleCommand = async (
  data: APIChatInputApplicationCommandInteraction
) => {
  // const client = new EC2Client({ region: 'REGION' });
};

/**
 * Main handler
 */
export const handler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async (event) => {
  const isValid = await validate(event);

  if (!isValid) {
    console.log('Invalid signature');
    return buildResult(401, { error: 'Invalid signature' });
  }

  const body = JSON.parse(event.body as string) as APIInteraction;

  console.log('Event type:', body.type);

  if (body.type === InteractionType.Ping) {
    console.log('pong!');
    return buildResult(200, {
      type: InteractionResponseType.Pong,
    } satisfies APIInteractionResponsePong);
  }

  if (body.type !== InteractionType.ApplicationCommand) {
    console.log('Unsupported interaction type:', body.type);
    return buildResult(400, { error: 'Unsupported interaction type' });
  }

  console.log('data', body.data);

  return buildResult(200, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'Congrats on sending your command!',
    },
  } satisfies APIInteractionResponseChannelMessageWithSource);
};
