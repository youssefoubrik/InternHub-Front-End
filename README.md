# InternHub

InternHub connects students looking for internships with companies recruiting emerging talent. The platform includes public internship discovery, student and company workspaces, application tracking, profile management, and admin moderation.

**Frontend:** Next.js · **Backend:** Spring Boot REST API ([backend README](../InternHub_backend/README.md))

## Features

### Discover internships

Visitors can explore the platform and browse internship listings. Search and filters help students narrow opportunities; each listing includes role details, requirements, company information, and an application action.

![InternHub landing page](public/internhub-screenshots/guest-hero.png)

| Browse internships                                                         | Filter search results                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ![Internship listings](public/internhub-screenshots/browseInternships.png) | ![Filtered internship search](public/internhub-screenshots/browseInternships-filter.png) |

### Student accounts and applications

Students can register, verify their email, sign in, and reset a forgotten password. They can review internship details, submit an application with supporting documents, and track their applications and statuses.

| Student sign-up                                                         | Email verification                                                   |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| ![Student sign-up form](public/internhub-screenshots/signupStudent.png) | ![Verify email screen](public/internhub-screenshots/verifyEmail.png) |

| Internship details                                                                                    | Apply to an internship                                                  |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ![Internship details and application action](public/internhub-screenshots/internship-studentview.png) | ![Application form](public/internhub-screenshots/applyToInternship.png) |

![Student applications](public/internhub-screenshots/student-applications-pending.png)

### Student profiles

Students can manage their profile information and build a portfolio with education, experience, projects, and certificates.

| Student profile                                                                 | Edit profile information                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ![Student profile](public/internhub-screenshots/studentProfile-modifyInfos.png) | ![Edit student profile](public/internhub-screenshots/studentProfile-1.png) |

| Add education                                                   | Add experience                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------------- |
| ![Add education](public/internhub-screenshots/newEducation.png) | ![Add experience](public/internhub-screenshots/newExperience.png) |

| Add a project                                               | Add a certificate                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| ![Add project](public/internhub-screenshots/addProject.png) | ![Add certificate](public/internhub-screenshots/addCertificat.png) |

### Company workspace

Companies can create accounts, verify their email, manage company profiles, and publish internship listings through a multi-step form. The company dashboard provides an overview of applications and posted internships; recruiters can review applications and update their status.

| Company sign-up                                                         | Company profile                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| ![Company sign-up form](public/internhub-screenshots/signupCompany.png) | ![Company profile](public/internhub-screenshots/companyProfile.png) |

| Edit company profile                                                                    | Create an internship                                                               |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ![Company profile editing](public/internhub-screenshots/updateCompanyProfileForm-1.png) | ![Internship creation form](public/internhub-screenshots/postInternshipForm-1.png) |

![Company application dashboard](public/internhub-screenshots/companyProfile-3.png)

### Admin tools and safety

Administrators can review platform statistics, manage registered companies, and moderate reports. Report workflows include reviewing report details and history, resolving reports, and sending warnings or account block notifications.

| Admin dashboard                                                      | Manage companies                                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ![Admin dashboard](public/internhub-screenshots/admin-dashboard.png) | ![Company management dashboard](public/internhub-screenshots/manageCompanies.png) |

| Flagged companies                                                                 | Report details                                                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Flagged companies overview](public/internhub-screenshots/flagged-companies.png) | ![Company report details](public/internhub-screenshots/companyFlagDetails.png) |

| Resolve a report                                                   | Send a warning                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| ![Resolve a report](public/internhub-screenshots/resolveFlags.png) | ![Send a warning](public/internhub-screenshots/sendWarning.png) |

| Block                                                             | Block Email                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| ![Block a company](public/internhub-screenshots/blockCompany.png) | ![Block Email](public/internhub-screenshots/blockCompanyEmail.png) |

| unBlock |
| ------- |

| ![Unblock a company](public/internhub-screenshots/companyUnBlock.png)

### Password Reset

| Password Reset                                                       | Password Reset Email                                                          |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ![Password Reset](public/internhub-screenshots/forgotPassword-2.png) | ![Password Reset Email](public/internhub-screenshots/forgotPasswordEmail.png) |

## More screenshots

The [`public/internhub-screenshots/`](public/internhub-screenshots/) folder contains additional screens, including password recovery, contact, company report history, and account moderation emails.

## Run locally

### Requirements

- Node.js (LTS recommended)
- npm
- The InternHub backend running locally or a configured API endpoint

### Install and start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Configure the frontend API URL using the environment variable expected by [`lib/axios.ts`](lib/axios.ts) and see the [backend setup instructions](../InternHub_backend/README.md) for API and service configuration.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production app
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

## Tech stack

- Next.js and React
- TypeScript
- Tailwind CSS
- Axios for backend API requests
