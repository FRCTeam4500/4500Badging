# 4500 Badge Website

> An interactive view of FRC Team 4500's **Badging and Certification**

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
	- [Basic](#basic)
	- [Styling](#styling)
- [File Structure](#file-structure)
	- [Lib](#lib)
		- [db.ts](#dbts)
		- [current-profile.ts](#current-profilets)
		- [initial-profile.ts](#initial-profilets)
		- [utils.ts](#utilsts)
	- [Hooks](#hooks)
		- [useIsVisible](#useisvisible)
		- [useModal](#usemodal)
	- [Components](#components)
		- [Modals](#modals)
		- [Providers](#providers)
		- [Sidebar](#sidebar)
		- [Tables](#tables)
		- [Ui](#ui)
	- [App](#App)
		- [Api](#api)

## Introduction

[A Detailed Look At The Badging System For The Programming Team](https://frcteam4500.github.io/mkdocs-4500-docs/2024%20Badge%20System/2024%20Badge%20System/)

## Technologies

### Basic

-   [TypeScript](https://www.typescriptlang.org/): Language
-   [React](https://reactjs.org/): Frontend Framework
-   [Next.js](https://nextjs.org/): React Framework
-   [Prisma](https://www.prisma.io/): Database
-   [PostgreSQL](https://www.postgresql.org/): Database Language
-   [Clerk](https://www.clerk.com/): Authentication
-   [Vercel](https://vercel.com/): Hosting
-   [Git](https://git-scm.com/): Version Control
-   [GitHub](https://github.com/): Version Control

### Styling

-   [Tailwind CSS](https://tailwindcss.com/): CSS Framework
-   [Radix UI](https://www.radix-ui.com/): Tailwind CSS Components
-   [ShadCn UI](https://ui.shadcn.com/): Tailwind CSS Components, Radix Remixes
-   [React Icons](https://react-icons.github.io/react-icons/): Icons

## File Structure

The configs for the website are in the various `ts`, `js`, and `json` files in the root directory.

The `app` directory contains the source code for the website.

The `components` directory contains the various components used in the website. These are written in `react tsx`, and they include the more specific parts of the website, such as the `badge-card` component.

Inside the `components` directory, there are slightly less self-explanatory directories, such as `modals` and `providers`. Modals are the popups that appear when you click on the `edit-profile-self-button`.
Providers are more specialized. The `modal-provider` is a component that wraps the entire website, and it provides the context for the modals to appear. They basically preload the modals so that they can be called from anywhere in the website.

The `hooks` directory contains hooks to be used throughout the website. Hooks are "functions" that can be called from anywhere in the website, and they can be used to store data, or to perform actions. For example, the `useIsVisible` hook can provide context as to whether a specific ref is visible, and the `useModal` hook is used to open and close modals as well as provide data when calling them. More details for these hooks are available below.

The `lib` directory contains various helper function that are used throughout the website. The `db.ts` file contains the functions that interact with the database, and the `current-profile.ts` file contains the functions that interact with the current profile. More details for these functions are available below.

The `prisma` directory contains the `prisma` schema, which is used to generate the `prisma` client. The `PrismaClient`(`db.ts`) is used to interact with the database. More details for these functions are available below.

The `public` directory contains the various static files used in the website. These are written in `html`, `css`, `js`, `png`, `svg`, `ico`, `xml`, `webmanifest`, and `json`, and they include the more general parts of the website, such as the `favicon.ico` file. Assets such as images and fonts are also stored in this directory.

### Lib

Files in the `lib` directory are used to provide helper functions for the website.

#### db.ts

This file declares `prisma` as a global variable. This is then used to ensure only one instance of the `prisma` client is created. The `PrismaClient` is used to interact with the database. The `db.ts` file contains the functions that interact with the database.

Example usage from badge api:

```ts
const badges = await db.badge.findMany({
    orderBy: {
        level: "asc",
    }
});
```
In the above code, the `db` is the `PrismaClient` that is used to interact with the database. The `badge` is the table in the database that is being interacted with. The `findMany` is the function that is being called on the `badge` table. The `orderBy` is the option that is being passed to the `findMany` function. The `level` is the column in the `badge` table that is being used to order the results. The `"asc"` is the direction that the results are being ordered in.

More info on the `prisma` client can be found [here](https://www.prisma.io/docs/concepts/components/prisma-client).

#### current-profile.ts

This file contains the functions that interact with the current profile. The current profile is the profile that is currently being viewed. This is used to provide context to the website, and it is used to determine whether the user is logged in.

More specifically, current profile gets the `Clerk` userId from the authentication service, and it uses that to get the profile from the database.

Example usage:

```ts
const profile = await currentProfile()
```
In the above code, the `profile` is the current profile. The `currentProfile` is the function that is being called to get the current profile.

#### initial-profile.ts

Initial profile is similar to current profile, but it is used to determine the initial profile that is loaded when the website is first loaded. If a user does not exist with the `Clerk` userId or email, then a new user is created with the `Clerk` userId and email. This is used to provide context to the website, and it is used to determine whether the user is logged in.

Instead of just recieving the `Clerk` userId, the `initialProfile` function recieves the entire `Clerk` user. This data is then used to get or create the profile through the database.

Example usage:

```ts
const profile = await initialProfile()
```
You want to run this function when the website is initially loaded, preferably on the homepage. Otherwise, use the `currentProfile` function.

> [!WARNING]  
> Running this function in areas where the user may very will lead to the creation of multiple profiles for the same user. If precreating profiles is necessary, ensure email is correct.

#### utils.ts

This file contains various utility functions that are used throughout the website. These functions are not specific to the database or the current profile.

Currently, the only util is `cn()`, a very useful function that is used to conditionally join classnames. This is used to conditionally apply classes to components.

Example usage from coach view:

```tsx
<div className={cn("text-red-500", { "text-blue-500": true })}>Hello!</div>
```
In the above code, the `cn` is the function that is being called to conditionally join classnames. The `"text-red-500"` is the classname that is always applied. The `{ "text-blue-500": true }` is the object that is used to conditionally apply the classname. The `"text-blue-500"` is the classname that is conditionally applied, and the `true` is the condition that determines whether the classname is applied.

> [!NOTE]
> The above implementation may seem useless, but it is very useful when the condition is a boolean value. For example, the following code will apply the `text-blue-500` classname if the `isBlue` variable is true, and it will not apply the classname if the `isBlue` variable is false. eg.
> ```tsx
> <div className={cn("text-red-500", { "text-blue-500": isBlue })}>Hello!</div>
> ```
> Where `isBlue` is a boolean value.

### Hooks

Hooks are "functions" that provide useful context to the website. They can be used to store data, or to perform actions.

#### useIsVisible

This hook uses an IntersectionObserver to determine whether a specific ref is visible. It returns a boolean value that can be used to determine whether the ref is visible. example usage:

```tsx
const ref = useRef(null);
const isVisible = useIsVisible(ref);

return <div ref={ref}>{isVisible ? "Visible" : "Not Visible"}</div>;
```

This is useful for lazy loading components, through it has lots more use expecially when it comes to animations. Example animation usage:

```tsx
const ref = useRef(null);
const isVisible = useIsVisible(ref);

return <div ref={ref} className={`transition-opacity ease-in duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>Hello!</div>
```
The above code will fade in the text "Hello!" when it is visible.

#### useModal

This hook is used to open and close modals. It contains data:

```tsx
interface ModalData {
  badge?: Badge;
  accessor?: Profile;
  profile?: Profile;
  apiUrl?: string;
  query?: Record<string, any>;
}
```
Where `badge` is the badge to be edited, `accessor` is the profile that is being edited, `profile` is the profile that is being viewed, `apiUrl` is the url to send the request to, and `query` is the query to send to the server. The `apiUrl` and `query` are used to send requests to the server, and the `badge`, `accessor`, and `profile` are used to provide context to the modals.

All functions and data for this hook is stored in the `ModalStore` context.

```tsx
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
```
The `type` is the type of modal to open, the `data` is the data to pass to the modal, the `isOpen` is a boolean value that determines whether the modal is open, the `onOpen` function is used to open the modal, and the `onClose` function is used to provide details related to the closing of the modal.

Example usage from the `edit-profile-self-button`:

```tsx
export const EditProfileSelfButton = ({ profile }: { profile: Profile }) => {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen("editProfileSelf", { profile })} variant="ghost" size="icon">
      <Edit2Icon className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
    </Button>
  );
};
```

### Components

Components are the various components used in the website. These are written in `react tsx`, and they include the more specific parts of the website, such as the `BadgeCard` component.

#### Modals

Modals are the popups that appear when you click on the `edit-profile-self-button`. They are written in `react tsx`, and they include the various modals that appear in the website, such as the `edit-profile-self-modal` component.

#### Providers

Providers are more specialized. The `modal-provider` is a component that wraps the entire website, and it provides the context for the modals to appear. They basically preload the modals so that they can be called from anywhere in the website.

#### Sidebar

The sidebar is the sidebar that appears on the left side of the website (Currently available for coaches). It is written in `react tsx`, and it includes the various components that appear in the sidebar, such as the `SidebarMember` component.

#### Tables

Arguably one of the most difficult parts of the website. Contains code to parse and display all profiles (Currently available for coaches). It is written in `react tsx`, and uses ShadCN UI Tables to display the data.

#### Ui

The `ui` directory contains the various components that are used throughout the website. These are written in `react tsx`, and they include the more general parts of the website, such as the `Button` component. These are from the [ShadCN UI](https://ui.shadcn.com/) library.

### App

The `app` directory contains the source code for the website.

#### api

The `api` directory contains the api routes for the website. These are used to send requests to the server. These are written in `javascript`, and they include the various routes nesessary to communicate between our database and website of the website, such as `app/api/badges/route.ts` which contains the GET and POST routes for the badges.

These requests take headers, except for the GET requests. The headers are used to authenticate the user and provide details on the task, and they are used to determine whether the user is allowed to perform the action.

NextJS has a built in API route handler, and it is used to handle the requests. The `req` is the request, and the `res` is the response. The `res` is used to send the response to the client. It uses [slugs](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) to support dynamic routes. This means that the routes can be used to send requests to different profiles, badges, etc. eg: `app/api/profiles/[profileId]/route.ts` can be used to send requests to the profile with the id of `profileId`.

The Profile Id can then be accessed like so:

```ts
export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
	//...Code Goes Here, usually try catch
}
```
Where `params` is the parameters passed to the route, and `profileId` is the profile id.

There are different types of requests, and they are used to perform different actions. The `GET` request is used to get data from the database, the `POST` request is used to create data in the database, the `PATCH` request is used to update data in the database, and the `DELETE` request is used to delete data from the database.

Example usage of submitting PATCH request to `app/pages/api/profiles/[profileId]/route.ts` from `app/components/modals/edit-phone-self-modal.tsx`:

```tsx
const onSubmit = async (values: z.infer<typeof formSchema>) => {
	try {
		(async () => {
			console.log(profile?.id);
			const rawResponse = await fetch(`/api/profiles/${profile?.id}`, {
				method: "PATCH",
				headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				},
				body: JSON.stringify({
				phoneNumber: values.phoneNumber,
				mainSubteam: values.mainSubteam,
				isSelf: true,
				}),
			});
			const content = await rawResponse.json();
			console.log(content); // TODO: DO SOMETHING ELSE WITH IT
			router.refresh();
		})();

		form.reset();
		router.refresh();
		toast({
			title: "Phone Number Updated",
			description: "Your phone number has been updated.",
		});
		onClose();
	} catch (error) {
		console.error(error);
	}
};
```
Where `profile?.id` is the profile id, `values.phoneNumber` is the phone number to update, `values.mainSubteam` is the main subteam to update, and `isSelf` is a boolean value that determines whether the profile is the current profile.

> [!NOTE]
> The above implementation is from the `edit-phone-self-modal` component. It is used to update the phone number and main subteam of the current profile. This involves the use of a form. Forms can get complicated very quickly, but here is a good resource to get started: [React Hook Form](https://react-hook-form.com/).
