import * as React from "react";

export default function MyComponent() {
  return (
    <div className="bg-rose-100 flex flex-col items-center px-5">
      <div className="flex w-full max-w-[1040px] flex-col items-stretch mt-14 mb-36 max-md:max-w-full max-md:my-10">
        <div className="flex items-center justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-indigo-700 text-4xl my-auto">Whoa</div>
          <div className="text-neutral-100 text-xl font-bold whitespace-nowrap bg-indigo-700 self-stretch grow items-center px-5 py-3 rounded-md">
            Sign Up
          </div>
        </div>
        <div className="text-black text-5xl font-bold whitespace-nowrap mt-12 max-md:max-w-full max-md:text-4xl max-md:mt-10">
          Login now
        </div>
        <div className="text-black text-xl whitespace-nowrap mt-7 max-md:max-w-full">
          Hi, Welcome back 👋{" "}
        </div>
        <div className="mt-1 max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[52%] max-md:w-full max-md:ml-0">
              <div className="flex grow flex-col mt-16 max-md:max-w-full max-md:mt-10">
                <div className="text-black text-lg font-semibold self-stretch whitespace-nowrap max-md:max-w-full">
                  Email
                </div>
                <div className="text-black text-opacity-30 text-base font-medium whitespace-nowrap bg-rose-300 self-stretch mt-6 px-5 py-4 rounded-md max-md:max-w-full max-md:pl-1">
                  Enter your email id
                </div>
                <div className="text-black text-lg font-semibold self-stretch whitespace-nowrap mt-6 max-md:max-w-full">
                  Password
                </div>
                <div className="bg-rose-300 self-stretch flex justify-between gap-5 mt-5 px-6 py-2.5 rounded-md max-md:max-w-full max-md:flex-wrap max-md:px-5">
                  <div className="text-black text-opacity-30 text-base font-medium mt-2.5">
                    Enter your password
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/fababbda-14da-496c-b749-e120d33a43d1?"
                    className="aspect-square object-contain object-center w-[29px] overflow-hidden self-stretch shrink-0 max-w-full"
                  />
                </div>
                <div className="self-stretch flex w-full items-stretch justify-between gap-5 mt-4 max-md:max-w-full max-md:flex-wrap">
                  <div className="flex items-stretch justify-between gap-2.5">
                    <div className="bg-white flex w-[18px] shrink-0 h-[18px] flex-col rounded-sm border-0 border-solid border-black border-opacity-50" />
                    <div className="text-black text-base font-medium self-center whitespace-nowrap my-auto">
                      Remember Me
                    </div>
                  </div>
                  <div className="text-indigo-700 text-base font-semibold whitespace-nowrap self-start">
                    Forgot Password?
                  </div>
                </div>
                <div className="text-white text-xl font-medium whitespace-nowrap bg-indigo-700 self-stretch items-center mt-10 px-5 py-3.5 rounded-md max-md:max-w-full">
                  Login
                </div>
                <div className="text-rose-300 text-base font-medium underline self-center whitespace-nowrap mt-3.5">
                  <span className="text-black">Not registered yet?</span>
                  <span className="text-stone-700"> </span>
                  <span className="text-indigo-700">Create an account</span>
                  <span className="text-stone-700"> </span>
                  <span className="text-rose-300">SignUp</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[48%] ml-5 max-md:w-full max-md:ml-0">
              <img
                loading="lazy"
                srcSet="..."
                className="aspect-[1.21] object-contain object-center w-full overflow-hidden max-md:max-w-full max-md:mt-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
