Nice, good choice 👌 Using the package will give you a lot more control.

I’ll give you a practical architecture you can literally follow:

0. High-level architecture

Next.js (frontend)

Shows avatars using <Image /> or <img />

Calls your own API to get the avatar image.

NestJS (backend)

Uses DiceBear npm package to generate SVG on the fly.

Exposes an endpoint like:
GET /avatars/:seed.svg

(Optional) Adds caching headers or CDN in front.

Database (optional)

Store only userId and maybe avatarSeed.

You can also just use userId as the seed.

Flow:

Next.js ➜ calls https://api.yourapp.com/avatars/USER_SEED.svg ➜ NestJS generates SVG using DiceBear ➜ returns SVG.

1. Install DiceBear in NestJS

In your NestJS project:

npm install @dicebear/core @dicebear/fun-emoji
# or
yarn add @dicebear/core @dicebear/fun-emoji


You can swap fun-emoji with any style you like later.

2. Create an AvatarService in NestJS

src/avatar/avatar.service.ts:

import { Injectable } from '@nestjs/common';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/fun-emoji';

@Injectable()
export class AvatarService {
  generateSvg(seed: string): string {
    const avatar = createAvatar(funEmoji, {
      seed,
      // optional: more options, like backgroundColor, radius, etc
      // backgroundColor: ['b6e3f4'],
      // radius: 50,
    });

    return avatar.toString(); // SVG string
  }
}

3. Create an AvatarController in NestJS

src/avatar/avatar.controller.ts:

import { Controller, Get, Header, Param } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('avatars')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  // GET /avatars/:seed.svg
  @Get(':seed.svg')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  getAvatar(@Param('seed') seed: string) {
    const safeSeed = seed || 'default'; // fallback
    return this.avatarService.generateSvg(safeSeed);
  }
}


Route example:
https://api.yourapp.com/avatars/1765391758011-cffovjulvf9.svg

Cache-Control lets browser/CDN cache it aggressively.

4. Register AvatarModule in NestJS

src/avatar/avatar.module.ts:

import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';

@Module({
  providers: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}


Then import it in AppModule:

// src/app.module.ts
import { Module } from '@nestjs/common';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [AvatarModule],
})
export class AppModule {}


Now your backend is ready 🎉

5. Decide how to generate the seed

Options:

Simplest: use user.id as seed.

Or store a random seed per user like you already have (1765391758011-cffovjulvf9).

Example (pseudo DB schema):

// User table
id: string
name: string
avatarSeed: string // optional, if you want random


If avatarSeed is null, you can just default to id.

6. Use it in Next.js (frontend)

Let’s say you have user object with avatarSeed or id.

// components/Avatar.tsx
import Image from "next/image";

type AvatarProps = {
  seed: string;
  size?: number;
};

export function Avatar({ seed, size = 64 }: AvatarProps) {
  const url = `https://api.yourapp.com/avatars/${encodeURIComponent(seed)}.svg`;

  return (
    <Image
      src={url}
      alt="User avatar"
      width={size}
      height={size}
    />
  );
}


Then:

// somewhere in your UI
<Avatar seed={user.avatarSeed ?? user.id} size={80} />


If your NestJS API is on the same domain or via Next.js rewrites, you can even call /api/avatars/... instead of full URL.


8. Extra nice-to-haves
a) Default avatar

If user has no seed:

Backend: if seed empty ➜ use "default" or random.

Frontend: pass a default like "guest".

b) Support multiple styles

Add a style query or param:

// GET /avatars/:style/:seed.svg
@Get(':style/:seed.svg')
...
getAvatar(@Param('style') style: string, @Param('seed') seed: string) {
  const safeSeed = seed || 'default';

  // choose sprite
  const sprite = style === 'fun-emoji' ? funEmoji : funEmoji; // extend later

  const avatar = createAvatar(sprite, { seed: safeSeed });
  return avatar.toString();
}


Then on frontend: /avatars/fun-emoji/<seed>.svg.

c) Security

Don’t accept crazy long seeds (limit length).

Optionally rate-limit /avatars/* routes.

TL;DR “recipe”

Install @dicebear/core + a style in Nest.

Create AvatarService → generateSvg(seed).

Add AvatarController → GET /avatars/:seed.svg returning SVG.

Use seed = user.id or stored in DB.

Next.js: <Image src="https://api.yourapp.com/avatars/{seed}.svg" />.

Add caching and image config.

