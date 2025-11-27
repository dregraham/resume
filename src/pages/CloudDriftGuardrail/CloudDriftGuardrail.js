import React from "react";
import SimpleNav from "../../Components/SimpleNav";

export default function CloudDriftGuardrail() {
  const [isBlurbExpanded, setIsBlurbExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("ci");
  const ciCdCode = `stages:
  - validate
  - plan
  - apply

variables:
  TF_WORKING_DIR: "./terraform"

# ======================
# VALIDATE
# ======================
validate:
  stage: validate
  image:
    name: hashicorp/terraform:1.9
    entrypoint: ["/bin/sh", "-c"]
  script:
    - terraform -chdir=$TF_WORKING_DIR init
    - terraform -chdir=$TF_WORKING_DIR validate

# ======================
# PLAN
# ======================
plan:
  stage: plan
  image:
    name: hashicorp/terraform:1.9
    entrypoint: ["/bin/sh", "-c"]
  script:
    - terraform -chdir=$TF_WORKING_DIR plan -out=plan.out
  artifacts:
    paths:
      - "$TF_WORKING_DIR/plan.out"

# ======================
# APPLY
# ======================
apply:
  stage: apply
  when: manual
  image:
    name: hashicorp/terraform:1.9
    entrypoint: ["/bin/sh", "-c"]
  script:
    - terraform -chdir=$TF_WORKING_DIR apply -auto-approve

# ======================
# DEPLOY-INFRA
# ======================
deploy-infra:
  stage: apply
  when: manual
  image:
    name: hashicorp/terraform:1.9
    entrypoint: ["/bin/sh", "-c"]
  script:
    - aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
    - aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
    - aws configure set region "$AWS_REGION"
    - terraform -chdir=$TF_WORKING_DIR init
    - terraform -chdir=$TF_WORKING_DIR apply -auto-approve
`;

  const dockerCode = `FROM public.ecr.aws/lambda/nodejs:18

  WORKDIR /var/task
  
  COPY package*.json ./
  RUN npm ci --omit=dev
  
  COPY index.mjs .
  
  CMD ["index.handler"]
  `;

  const steps = [
    {
      number: "01",
      title: "EC2 INSTANCE SCAN",
      desc: "Scans all running EC2 instances in your AWS account on a schedule or via Lambda trigger.",
      color: "from-blue-400 to-blue-600"
    },
    {
      number: "02",
      title: "TAG VALIDATION",
      desc: `Checks each instance for the presence of a 'prod' tag. Instances without this tag are flagged as non-production.<br/><em>This tag can be customized to fit whatever resource you want to control drift on.</em>`,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      number: "03",
      title: "AUTOMATED STOP ACTION",
      desc: "Automatically stops EC2 instances that are missing the 'prod' tag, preventing unnecessary costs from idle or forgotten resources.",
      color: "from-red-400 to-red-600"
    },
    {
      number: "04",
      title: "CONTAINERIZED FOR DEPLOYMENT",
      desc: "Packaged as a Docker image using a custom Dockerfile for easy deployment to any environment.",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      number: "05",
      title: "COST CONTROL & REPORTING",
      desc: "Sends notifications or logs actions taken, providing visibility and auditability for cloud hygiene and cost control.",
      color: "from-green-400 to-green-600"
    }
  ];

  return (
    <>
      <SimpleNav />
      <main className="font-inter text-gray-800">
        {/* HERO SECTION */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: 'desyrelregular, serif' }}>
            Cloud Drift Guardrail
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
            Automated EC2 drift detection and cost control for AWS. Instantly stops non-production instances and enforces run windows to prevent cloud cost overruns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://gitlab.com/dregraham-group/cloud-drift-guardrail" target="_blank" rel="noopener noreferrer"
              className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
              View Source Code
            </a>
          </div>
        </section>

        {/* HOW IT WORKS STEPS */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-12" style={{ fontFamily: 'desyrelregular, serif' }}>How It Works</h2>
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="mb-2">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} text-white font-bold flex items-center justify-center text-xl shadow-md flex-shrink-0 mr-6`}>
                      {step.number}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 mb-1" style={{ letterSpacing: 0.5 }}>{step.title}</div>
                      {step.number === "02" ? (
                        <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc }} />
                      ) : (
                        <div className="text-gray-600 leading-relaxed">{step.desc}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CODE SNIPPETS TABS */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-6 py-2 font-semibold focus:outline-none ${activeTab === "ci" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
                onClick={() => setActiveTab("ci")}
              >
                GitLab CI/CD Pipeline
              </button>
              <button
                className={`ml-4 px-6 py-2 font-semibold focus:outline-none ${activeTab === "docker" ? "border-b-2 border-blue-600 text-blue-700" : "text-gray-500"}`}
                onClick={() => setActiveTab("docker")}
              >
                Dockerfile
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {activeTab === "ci" && (
                <>
                  <div style={{
                    background: '#232326',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.97rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid #333'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginRight: 6}} xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="4" fill="#FCA121"/><path d="M6 14V6H8.5L10 10.5L11.5 6H14V14H12V9.5L10.75 13.5H9.25L8 9.5V14H6Z" fill="white"/></svg>
                    <a href="https://gitlab.com/dregraham-group/cloud-drift-guardrail/-/blob/0f3b129eb9263d0ac99ad01fd4bee4d2320ab58a/.gitlab-ci.yml">.gitlab-ci.yml</a>
                  </div>
                  <pre style={{ background: '#222', color: '#fff', padding: '1.1rem', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', fontSize: '0.97em', overflowX: 'auto', margin: 0, minHeight: 180, maxHeight: 180 }}><code>{ciCdCode}</code></pre>
                </>
              )}
              {activeTab === "docker" && (
                <>
                  <div style={{
                    background: '#232326',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.97rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid #333'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{marginRight: 6}} xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="4" fill="#2496ED"/><path d="M6 14V6H14V14H6Z" fill="white"/></svg>
                    <a href="https://gitlab.com/dregraham-group/cloud-drift-guardrail/-/blob/0f3b129eb9263d0ac99ad01fd4bee4d2320ab58a/lambda/drift-checker/Dockerfile">Dockerfile</a>
                  </div>
                  <pre style={{ background: '#222', color: '#fff', padding: '1.1rem', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', fontSize: '0.97em', overflowX: 'auto', margin: 0, minHeight: 180, maxHeight: 180 }}><code>{dockerCode}</code></pre>
                </>
              )}
            </div>
          </div>
        </section>

        {/* BUILD STORY SECTION */}
        <div className={`how-built-blurb ${isBlurbExpanded ? 'expanded' : ''}`} onClick={() => setIsBlurbExpanded(!isBlurbExpanded)}>
          <h3>The Build Story {isBlurbExpanded ? '−' : '+'}</h3>
          {isBlurbExpanded && (
            <div className="blurb-story" style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
                <p><strong>Origin:</strong> <br/>
                  Cloud Drift Guardrail was born out of a real-world pain point: while building my <strong><a href="http://localhost:3000/#/projects/multicloud-iac" style={{color: '#2563eb', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" onClick={e => {e.stopPropagation();}}>Multi-Cloud IaC</a></strong> project, I discovered that ephemeral EC2 instances were often left running due to failed workflow runs, causing surprise AWS bills.
                </p>
                <p><strong>Problem:</strong> <br/>
                  Unattended cloud resources can quickly accumulate costs and clutter your environment.
                </p>
                <p><strong>Solution:</strong> <br/>
                  I built this tool to scan for EC2 instances missing a <strong>"prod"</strong> tag and stop them automatically, enforcing policies and keeping cloud spend under control.
                </p>
                <p><strong>Result:</strong> <br/>
                  This automation has saved time, $$, and headaches - helping me and my wallet! The best part is it can be reused for any resource you want to control drift on. Check out my repository to get started!
                </p>
            </div>
          )}
        </div>

        {/* README LINK SECTION */}
        <section className="py-16 bg-white">
          <div className="text-center">
            <a
              href="https://gitlab.com/dregraham-group/cloud-drift-guardrail/-/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              README.md →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}