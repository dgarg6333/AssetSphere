import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsTwitter, BsGithub } from 'react-icons/bs';
import { useSelector } from 'react-redux'; 
import RegisterInstituteModal from './registerInstitute';

export default function FooterCom() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    // Changed top border color to blue-800 for consistency
    <Footer container className='border border-t-8 border-blue-800'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              {/* ATI in yellow-400 */}
              <span className='text-yellow-400'>
                ATI
              </span>
              {/* CTI in blue-800 */}
              <span className='text-blue-800'>
                CTI
              </span>
            </Link>
            {/* Admin button for registering/approving institutes */}
            {currentUser && currentUser.isAdmin && (
              <RegisterInstituteModal />
            )}
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='Follow us' className='font-bold' />
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
                  Twitter/X
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
              <Footer.Title title='Legal' className='font-bold' />
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
            by="Deepanshu Garg Asset app"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            {/* Social icons styled with blue text and yellow hover */}
            <Footer.Icon href='https://twitter.com/Deepans51432965?t=qF3zJY0F6nnB94FOEFp8-A&s=09' icon={BsTwitter} className='text-blue-800 hover:text-yellow-400 transition-colors duration-200' />
            <Footer.Icon href='https://github.com/dgarg6333' icon={BsGithub} className='text-blue-800 hover:text-yellow-400 transition-colors duration-200' />
          </div>
        </div>
      </div>
    </Footer>
  );
}
