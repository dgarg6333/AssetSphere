import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-blue-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link  to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'  >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Code
              </span>
              Sphere
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About Us' className='font-bold'/>
              <div className='py-2'>Deepanshu Garg</div> 
              <div></div>
            </div>
            <div>
              <Footer.Title title='Follow us' className='font-bold'/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/dgarg6333'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href='https://www.linkedin.com/in/deepanshu-garg-515a9022a'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link
                  href='https://twitter.com/Deepans51432965?t=qF3zJY0F6nnB94FOEFp8-A&s=09'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Tweeter
                </Footer.Link>
                <Footer.Link
                  href='https://discord.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' className='font-bold'/>
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Deepanshu Garg mern-blog app"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='' icon={BsInstagram}/>
            <Footer.Icon href='https://twitter.com/Deepans51432965?t=qF3zJY0F6nnB94FOEFp8-A&s=09' icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/dgarg6333' icon={BsGithub}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}
