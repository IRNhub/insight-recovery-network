import type { Article } from "./articles";

import { mentalHealthAndAddictionArticle } from "./article-008-mental-health-and-addiction";
import { benzodiazepineAddictionArticle } from "./article-009-benzodiazepine-addiction";
import { ketamineAddictionArticle } from "./article-010-ketamine-addiction";
import { cannabisAddictionArticle } from "./article-011-cannabis-addiction";
import { prescriptionDrugAddictionArticle } from "./article-012-prescription-drug-addiction";
import { batchTwoDetoxWithdrawalArticles } from "./article-batch-2-detox-withdrawal";
import { batchThreeCommercialDecisionArticles } from "./article-batch-3-commercial-decisions";

export const approvedArticles = [
  ...batchThreeCommercialDecisionArticles,
  ...batchTwoDetoxWithdrawalArticles,
  prescriptionDrugAddictionArticle,
  cannabisAddictionArticle,
  ketamineAddictionArticle,
  benzodiazepineAddictionArticle,
  mentalHealthAndAddictionArticle,
  {
    slug: "cocaine-addiction",
    title: "Cocaine Addiction: Signs, Risks and Treatment",
    excerpt: "Understand the signs and risks of cocaine addiction, what withdrawal can feel like and which UK treatment options may help.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-08-11",
    updatedDate: "2026-08-28",
    readingTime: 18,
    category: "Addiction & Substances",
    image: "/cocaine-addiction-signs-treatment-uk-hero.webp",
    ogImage: "/cocaine-addiction-signs-treatment-uk-hero-og.webp",
    imageAlt: "Person reflecting by a window while beginning recovery from cocaine addiction.",
    seoTitle: "Cocaine Addiction: Signs, Risks and Treatment | IRN",
    metaDescription: "Learn the signs and risks of cocaine addiction, what withdrawal can feel like, and which UK treatment options may help. Includes urgent-help advice.",
    ogTitle: "Cocaine Addiction: Signs, Risks and Treatment",
    ogDescription: "A clear UK guide to cocaine addiction, withdrawal, treatment choices and when to seek urgent help.",
    publishedStatus: "published",
    medicalWebPage: true,
    supportingImages: [
      {
        afterHeading: "What should a cocaine addiction assessment cover?",
        src: "/cocaine-addiction-confidential-assessment.webp",
        alt: "Recovery practitioner carrying out a confidential cocaine use assessment.",
        caption: "A good assessment considers cocaine use, physical and mental health, safety, relationships and the person's recovery goals.",
      },
      {
        afterHeading: "Relapse prevention and what to do after a lapse",
        src: "/cocaine-recovery-plan-triggers-support.webp",
        alt: "Person making a practical weekly recovery plan at home.",
        caption: "Recovery planning turns good intentions into specific steps for cravings, triggers and support.",
      },
    ],
    faq: [
      {
        "question": "How do I know if I am addicted to cocaine?",
        "answer": "Daily use is not required. Important signs include craving, repeated unsuccessful attempts to stop, using more or for longer than intended, and continuing despite health, relationship, financial or work harm. If cocaine is shaping decisions or repeatedly breaking your own limits, arrange a confidential assessment. Only a suitably qualified professional can diagnose a disorder, but you do not need to wait for the situation to become severe before asking for help."
      },
      {
        "question": "Is cocaine withdrawal dangerous?",
        "answer": "Cocaine withdrawal is different from alcohol or benzodiazepine withdrawal and does not usually use the same medically assisted detox approach. It can still be clinically serious. Severe depression, suicidal thinking, psychosis, agitation or profound insomnia need prompt assessment. Emergency symptoms linked to recent cocaine use - including chest pain, seizure, collapse or stroke signs - require 999 or A&E. Risk depends on recent use, other substances and physical and mental health."
      },
      {
        "question": "How long does cocaine withdrawal last?",
        "answer": "There is no single reliable timetable. A crash may bring fatigue, sleep change, low mood, appetite change and craving after use stops. The most intense symptoms may ease while sleep, motivation, mood or cue-triggered cravings continue to fluctuate. The practical question is not only duration but safety and support. Persistent depression, inability to function, psychosis or suicidal thoughts should be assessed rather than managed by waiting for a deadline."
      },
      {
        "question": "Is there a medication for cocaine addiction?",
        "answer": "There is no routine substitute medicine for cocaine dependence comparable with opioid substitution treatment. UK guidance places psychosocial and non-pharmacological interventions at the centre of care. A prescriber may treat a separate condition or an acute symptom, but medicines do not replace recovery work and can carry interaction risks if cocaine use continues. Always tell the prescriber about cocaine, alcohol, other drugs and current medication."
      },
      {
        "question": "Do I need residential rehab for cocaine addiction?",
        "answer": "Not necessarily. Most treatment begins in the community. Residential care may be considered when use is severe or persistent, the home environment is unsafe, previous community treatment has not helped, or significant physical, mental health or social problems require intensive support. A placement decision should follow assessment and examine clinical capability, medical arrangements and aftercare rather than choosing on price or accommodation alone."
      },
      {
        "question": "Can online recovery support help with cocaine addiction?",
        "answer": "Online support can provide structure, therapeutic contact, education, accountability and relapse planning while a person remains at home. It may fit when there is no acute medical or psychiatric emergency and the home environment is sufficiently safe. It is not a replacement for emergency care, medically managed withdrawal from another substance or inpatient mental health treatment. Suitability should be assessed and reviewed if risk changes."
      }
    ],
    sources: [
      {
        "title": "Cocaine addiction: get help",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/live-well/addiction-support/cocaine-get-help/"
      },
      {
        "title": "Drug misuse and dependence: UK guidelines on clinical management",
        "publisher": "Department of Health and Social Care",
        "url": "https://www.gov.uk/government/publications/drug-misuse-and-dependence-uk-guidelines-on-clinical-management"
      },
      {
        "title": "Drug misuse in over 16s: psychosocial interventions",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg51/chapter/recommendations"
      },
      {
        "title": "Cocaine: effects and risks",
        "publisher": "FRANK",
        "url": "https://www.talktofrank.com/drug/cocaine"
      },
      {
        "title": "Adult substance misuse treatment statistics 2024 to 2025",
        "publisher": "Office for Health Improvement and Disparities",
        "url": "https://www.gov.uk/government/statistics/substance-misuse-treatment-for-adults-statistics-2024-to-2025/adult-substance-misuse-treatment-statistics-2024-to-2025-report"
      },
      {
        "title": "Help for suicidal thoughts",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/"
      },
      {
        "title": "When to call 999",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/"
      }
    ],
    content: `**Concise answer:** Cocaine addiction is not defined by using every day. It is a pattern in which craving, impaired control and continued use despite harm begin to disrupt health, relationships, work, finances or safety. Effective help starts with a thorough assessment. Treatment is usually psychosocial and may include contingency management, structured recovery planning, support for physical and mental health, family involvement and a level of care matched to risk. Urgent symptoms such as chest pain, seizures, severe agitation, psychosis or immediate suicide risk require emergency help.

This guide is for adults concerned about their own powder cocaine or crack cocaine use, and for families trying to understand what meaningful help looks like. It is educational, not a diagnosis or a substitute for individual medical advice.

## Table of contents

1. Key takeaways
2. What cocaine addiction means
3. Signs and symptoms
4. Why cocaine can become difficult to stop
5. Health and safety risks
6. Cocaine withdrawal and the crash
7. What an assessment should cover
8. Treatments that can help
9. Community, online or residential support
10. Practical steps to take now
11. Guidance for families
12. Relapse prevention
13. When to seek professional or emergency help
14. Frequently asked questions

## Key takeaways

- A person does not need to use cocaine daily to have an addiction. Repeated failed attempts to stop, craving and continued use despite harm are more informative than frequency alone.
- Cocaine can affect the heart, brain and mental health. Chest pain, a seizure, collapse, severe agitation, hallucinations or signs of stroke are emergencies.
- Low mood, exhaustion, sleep disturbance and craving can follow stopping. Severe depression, psychosis or suicidal thoughts need urgent assessment.
- UK guidance places psychosocial care at the centre of treatment. Contingency management has specific NICE support for people who primarily misuse stimulants.
- There is no routine substitute medicine for cocaine in the way that methadone or buprenorphine may be used for opioid dependence. Medicines may still be used by a clinician for separate or acute symptoms.
- Most treatment begins in the community. Residential care may be considered when risks or co-occurring physical, mental health or social needs make a more intensive setting appropriate.
- A lapse is a signal to review the plan, not evidence that recovery is impossible.

## What does cocaine addiction mean?

Cocaine is a stimulant. Powder cocaine is commonly snorted, while crack cocaine is usually smoked; cocaine may also be injected. Route matters for risk, but addiction is identified by the pattern and consequences of use rather than by a single amount, route or number of days.

The everyday word "addiction" broadly describes persistent use that has become difficult to control and continues despite significant harm. A clinician may use terms such as cocaine dependence or stimulant use disorder, depending on the assessment framework. Whatever label is used, the central questions are practical:

- Are you using more, for longer, or more often than you intended?
- Have you tried to cut down or stop and found that you could not maintain the change?
- Do cravings or plans to obtain cocaine occupy a growing amount of attention?
- Are health, money, work, relationships, parenting or safety being affected?
- Do you keep returning to cocaine even after deciding that the consequences are unacceptable?

The NHS explicitly notes that someone does not have to take cocaine or crack cocaine every day to be addicted. Weekend binges, pay-day use or apparently "social" use can still form a harmful, compulsive cycle. Conversely, one sign on its own does not establish a diagnosis. A proper assessment looks at the whole pattern, including context, risk and functioning.[1]

## Signs and symptoms of cocaine addiction

People often notice the consequences before they identify the pattern as addiction. Signs can be behavioural, psychological, physical and social. They vary with the person, route of use, other substances and existing health conditions.

### Behavioural and practical signs

- Repeatedly spending more money or time on cocaine than planned.
- Making rules such as "only at weekends" or "only with friends" and repeatedly breaking them.
- Hiding use, deleting messages, lying about money or creating explanations for absences.
- Missing work, appointments or family responsibilities after using or recovering from a binge.
- Prioritising cocaine-related people, places or events over activities that previously mattered.
- Borrowing, using credit, selling possessions or neglecting bills to fund use.
- Driving, working or caring for children while intoxicated, sleep-deprived or in a crash.
- Continuing after relationship conflict, a health scare, debt or disciplinary consequences.

### Psychological signs

- Strong craving or intrusive thoughts about the next opportunity to use.
- A short-lived sense of confidence or energy followed by anxiety, irritability, flatness or shame.
- Feeling unable to socialise, work, have sex or enjoy a night out without cocaine.
- Suspiciousness, panic, agitation or, in more severe cases, hallucinations or psychosis.
- Persistent low mood or loss of interest, particularly during or after a period of heavy use.

### Physical signs

- Palpitations, raised heart rate, sweating, overheating or reduced appetite.
- Sleep disruption, exhaustion and marked changes in energy.
- Nosebleeds, nasal pain or loss of smell when cocaine is snorted.
- Cough, breathing problems or chest symptoms when crack cocaine is smoked.
- Injection injuries or infection risk if cocaine is injected.
- Chest pain, severe headache, seizure, collapse or neurological symptoms - these require urgent assessment.

None of these signs should be used to accuse or diagnose another person. They are reasons for a calm conversation and, where possible, a confidential assessment.

### UK treatment context

In England, 169,542 adults started a new drug or alcohol treatment journey in 2024 to 2025. One in five reported a problem with powder cocaine. This is treatment-service data, not an estimate of cocaine addiction in the general population, and one person could report more than one substance. It does show why assessments must ask about alcohol and other drugs rather than treating cocaine use in isolation.[5]

## Why cocaine can become difficult to stop

Cocaine can create a powerful learning cycle. The immediate effects may include energy, alertness, confidence or relief from difficult feelings. Those effects are short-lived, which can encourage repeated dosing. The later crash can involve fatigue, low mood, irritability and craving, creating pressure to use again or to use alcohol, sedatives or other drugs in an attempt to change how the person feels.

Addiction is not a moral failure or a simple lack of willpower. Repeated behaviour becomes linked to cues: certain friends, locations, messages, music, cash, alcohol, stress, loneliness, sexual situations, work pressure or the end of the week. Over time, a cue can trigger craving before a person has consciously decided to use.

Risk is also shaped by the wider situation. Trauma, anxiety, depression, ADHD symptoms, unstable housing, isolation, easy availability and a workplace or social culture where cocaine is normalised may all complicate recovery. These factors do not make addiction inevitable, and they should not be used to explain every case. They do show why treatment needs to address more than the drug itself.

## Health and safety risks

Cocaine can cause serious harm even in someone who does not see themselves as dependent. Purity and contamination are unpredictable, and a person's response can change with dose, route, sleep, hydration, physical health and what else has been taken.

### Heart and circulation

Cocaine increases cardiovascular strain. Palpitations, chest pain and dangerous changes in heart rhythm can occur; heart attack and stroke are recognised risks. These events are not limited to older people or those with known heart disease. Call 999 for chest pain, collapse, severe breathing difficulty, a seizure or signs of stroke.[1][4][7]

### Mental health and the nervous system

Anxiety, panic, agitation, paranoia and sleep loss can worsen as use becomes heavier or more prolonged. Severe intoxication or sleep deprivation may contribute to psychosis. Seizures, very high body temperature and extreme agitation are medical emergencies. Cocaine may temporarily mask distress, while the crash can expose or intensify depression.

### Route-specific harm

Snorting can damage the tissue inside the nose. Smoking crack can harm the lungs and worsen respiratory symptoms. Injecting creates risks from wounds, bacterial infection, blood-borne viruses and overdose, particularly when equipment is shared or other drugs are involved. A treatment assessment should ask how cocaine is used without judgement because route changes the medical response.

### Cocaine and alcohol

Alcohol and cocaine are commonly used together, but the combination is not protective and should not be treated as routine or safe. It can increase cardiovascular and behavioural risk, make it harder to judge intoxication, and extend a session beyond what was intended. The safest advice is not to combine them. If alcohol has also become difficult to control, it needs its own assessment because dependent drinking can carry medically serious withdrawal risks.[2][4]

### Unknown strength and multiple substances

Illicit cocaine has no reliable dose or quality control. Taking it with opioids, sedatives, ketamine, cannabis or other stimulants can create additional and sometimes opposing effects that are difficult to predict. Tell a clinician honestly about all substances, prescribed medicines and supplements; this information is for safety, not punishment.

## Cocaine withdrawal and the crash

After repeated or heavy use, stopping may be followed by a "crash". Common experiences include exhaustion, increased sleep or disrupted sleep, low mood, reduced pleasure, irritability, increased appetite, poor concentration and strong craving. Symptoms do not follow an identical timetable. They may settle unevenly, and sleep, mood or craving can remain difficult after the most intense phase has passed.

Cocaine withdrawal is managed differently from alcohol or benzodiazepine withdrawal. The UK clinical guideline states that psychosocial and non-pharmacological care is the mainstay for stimulant dependence, and that medicines tested for stimulant withdrawal have not been shown to promote abstinence. General support and reassurance may be enough for less severe, short-lived symptoms; agitation, psychosis, severe insomnia or major depression may require close clinical monitoring and symptom-specific treatment.[2]

The most important risk is not captured by a simple detox timetable. Withdrawal can involve significant depression, so mood and suicide risk should be assessed. Seek urgent help if the person feels unable to stay safe, has suicidal thoughts with intent or a plan, becomes severely agitated, is hallucinating or appears detached from reality. Call 999 or go to A&E for immediate danger. If urgent help is needed but it is not a life-threatening emergency, NHS 111 can direct the next step.[2][6][7]

Do not assume that needing sleep after a binge means someone only needs to be left alone. Check that they are responsive, breathing normally and not showing emergency symptoms. If in doubt, seek medical advice.

## What should a cocaine addiction assessment cover?

A useful assessment is collaborative, confidential within explained safeguarding limits, and wider than a checklist. It should establish both the severity of the cocaine pattern and what could make change safer or more sustainable.

It will usually explore:

- Frequency, amount, route, binge pattern and the time since last use.
- Craving, impaired control, attempts to stop and previous periods of recovery.
- Powder cocaine, crack cocaine and any changes between routes.
- Alcohol, opioids, benzodiazepines, ketamine, cannabis, prescribed medicines and other substances.
- Chest pain, palpitations, seizures, breathing problems, nasal damage and other physical concerns.
- Mood, anxiety, trauma, ADHD symptoms, psychosis, self-harm and suicide risk.
- Sleep, nutrition, sexual health and exposure to violence or exploitation.
- Work, debt, housing, legal issues, parenting and safeguarding.
- Supportive relationships, family impact and the home recovery environment.
- The person's goals, motivation, preferences and practical constraints.

Drug testing can provide useful clinical information in some settings, but it is not a complete assessment and should not replace a therapeutic conversation. NICE emphasises collaboration, informed consent and care that is responsive to the person's needs.[3]

A recovery assessment should lead to a clear recommendation: what can begin now, what needs medical review, which setting is proportionate, and how risk will be managed if circumstances change.

## Treatments that can help

There is no single programme that suits everyone, but effective treatment is structured. It combines a strong therapeutic relationship with evidence-based behaviour change, attention to co-occurring needs, and a practical plan for high-risk situations.

### Contingency management

NICE recommends contingency management programmes for people who primarily misuse stimulants. Contingency management agrees a specific target, such as attendance or a drug-negative test, and provides a prompt, consistent incentive when that target is met. It is not bribery or punishment; it is a structured method of reinforcing recovery-supporting behaviour. Delivery requires trained staff, agreed goals and reliable monitoring.[3]

### Talking and behavioural support

The NHS describes talking therapies as part of cocaine treatment. Treatment may help a person understand triggers, test different responses, repair routines and build skills for cravings and setbacks.[1]

There is an important clinical nuance. NICE advises that drug-focused cognitive behavioural therapy or psychodynamic therapy should not be offered routinely as the default treatment for stimulant misuse. CBT can still be appropriate for co-occurring depression or anxiety in line with the relevant guideline, and other structured psychological work may be selected after assessment. Good care names the actual intervention and why it fits rather than using "therapy" as a vague promise.[3]

### Couples, family and mutual-aid support

Behavioural couples therapy may be considered when the person has a non-using partner who is willing to participate. Family work can improve communication, boundaries and consistency, while also supporting the family member's own wellbeing. NICE also recommends routinely providing information about self-help groups; some people value Cocaine Anonymous, Narcotics Anonymous or SMART Recovery as part of a wider plan.[1][3]

### Medication and medical care

There is no routine substitute medicine for powder cocaine, crack cocaine or other stimulants. A clinician may prescribe for a separate diagnosed condition or a short-term acute symptom, but that is different from a medicine that directly treats cocaine dependence. Medication decisions need a prescriber who knows about current cocaine and other drug use because interactions and risks matter.[1][2]

Physical complications should not be deferred until abstinence is established. Chest symptoms, severe nasal damage, breathing problems, infections, sexual-health needs and other medical concerns deserve assessment in their own right.

### Co-occurring mental health support

Depression, anxiety, trauma symptoms, ADHD or other mental health needs may pre-date cocaine use, follow it or interact in both directions. A careful assessment avoids two errors: attributing every symptom to cocaine, or treating mental health while ignoring ongoing stimulant use. The plan should coordinate both needs, monitor risk and review how symptoms change during a period of stability.

### Recovery planning and continuing care

Stopping is only one part of treatment. A continuing plan should cover cravings, sleep, alcohol and other drug use, money, digital contacts, risky environments, supportive people, meaningful activity and what to do after a lapse. Frequency of contact should match the early level of risk and reduce only when stability is demonstrated, not simply when motivation sounds strong.

## Community, online or residential support?

Most people receiving cocaine treatment begin while living at home. The NHS says residential rehabilitation is usually reserved for particularly severe or complicated situations.[1] The right setting depends on a combination of safety, complexity, previous response and the recovery environment.

### Community or online support may be suitable when

- There is no acute medical or psychiatric emergency.
- The person can attend consistently and engage honestly with monitoring.
- Housing is reasonably safe and stable.
- Cocaine can be addressed without unmanaged alcohol, benzodiazepine or opioid withdrawal.
- There is a workable crisis plan and access to local medical care when required.
- The person can create distance from supply, high-risk contacts and using environments.

Online support can reduce travel barriers and allow recovery work to fit around employment or caring responsibilities. It should not be presented as a substitute for emergency care, medical detoxification or inpatient psychiatric treatment. Suitability needs to be reviewed if use escalates, mental state deteriorates or the home environment becomes unsafe.

### Residential treatment may be considered when

- Cocaine use is severe, persistent or repeatedly returns despite well-delivered community treatment.
- Significant physical, mental health or social problems require a more contained multidisciplinary setting.
- The home environment is unsafe, unstable or saturated with access and triggers.
- There is serious safeguarding risk, exploitation, homelessness or repeated crisis.
- Co-occurring substance use requires medically supported withdrawal or closer observation.

NICE says residential treatment may be considered for people seeking abstinence who have significant co-occurring physical, mental health or social problems and who have not benefited from previous community psychosocial treatment. Placement should be based on clinical capability, safety and aftercare - not luxury features, price alone or the idea that distance automatically creates recovery.[3]

## Practical steps to take now

### If you are concerned about your own use

1. **Write down the pattern honestly.** Record days used, approximate spend, alcohol and other drugs, sleep, consequences and attempts to stop. This gives an assessment something concrete to work with.
2. **Tell one safe person.** Secrecy protects the cycle. Choose someone who can respond calmly and help with practical accountability.
3. **Reduce immediate access.** Delete dealer contacts, block routes used to obtain cocaine, move money controls into a safer arrangement and avoid the first high-risk event while support is being organised.
4. **Avoid mixing substances.** In particular, do not treat alcohol as a way to smooth the effects of cocaine or cocaine as a way to feel less drunk.
5. **Protect sleep and nutrition.** Regular meals, hydration and a predictable sleep routine do not treat addiction, but they reduce avoidable stress on early recovery.
6. **Book an assessment.** A GP, local NHS drug and alcohol service or an independent recovery assessment can help identify the appropriate level of care.
7. **Make an emergency plan.** Decide who to call and where to go for chest pain, collapse, severe agitation, psychosis or suicidal intent.

If you are not ready to stop today, you can still ask a local drug service or FRANK for confidential harm-reduction advice. The safest course is not to use cocaine, but support does not require you to pretend that you are already abstinent.[4]

### What not to rely on

- Willpower without a plan for people, places, money and alcohol.
- A few days away without continuing care on return.
- Drug testing as the only measure of progress.
- A promise made during a crash without follow-up when energy returns.
- Sedatives, alcohol or unprescribed medication to manage sleep or anxiety.
- A rehab choice based mainly on photographs, status or price.

## Guidance for families and partners

Families often move between fear, anger, rescue and exhaustion. You cannot force another adult to recover, but you can make your response safer and more consistent.

Choose a time when the person is not intoxicated or in acute withdrawal. Describe specific observations rather than labels: "You missed work twice after using and the rent money is gone" is harder to dismiss than "You're an addict". State the impact, the help you are willing to support and the boundaries you will maintain.

Useful boundaries are about your own actions. Examples include not giving cash, not covering up absences, not allowing cocaine in the home, not leaving children with someone who is intoxicated, and calling emergency services when there is immediate danger. A boundary is not an attempt to control every choice, and it needs a realistic consequence that the family can carry out.

Get support for yourself. Families may need advice about debt, safeguarding, domestic abuse, children, mental health and their own sleep or anxiety. A family consultation can help organise communication and treatment options without turning every interaction into a confrontation.

## Relapse prevention and what to do after a lapse

Relapse prevention begins before craving peaks. Map the sequence that usually comes first. For one person it may be alcohol, a pay-day message and staying out late. For another it may be loneliness, sexualised online contact, work pressure or several nights of poor sleep.

A usable plan includes:

- Early warning signs that someone else could notice.
- Specific high-risk people, places, apps, payment routes and times.
- A short craving response that can be started within minutes.
- At least two people or services to contact.
- A plan for alcohol and other substances, not just cocaine.
- Meaningful activities that provide structure and reward.
- A same-day response to a lapse.

After a lapse, check safety first. Seek medical help for concerning symptoms, avoid driving, and do not continue because the period of abstinence has already been "ruined". Tell the support person or service, identify what changed before the use, and intensify contact. The aim is to interrupt a return to the old pattern and revise the plan with evidence from what happened.

## When to seek professional or emergency help

Arrange a professional assessment if any of the following applies:

- Attempts to stop or control cocaine have repeatedly failed.
- Use is affecting health, mood, sleep, work, relationships, parenting or money.
- Cocaine is being combined with dependent alcohol use, opioids, benzodiazepines or other high-risk substances.
- There has been paranoia, hallucinations, severe agitation, self-harm or suicidal thinking.
- There are chest symptoms, seizures, nasal damage, breathing problems, injection injuries or pregnancy.
- The home environment is unsafe or there are safeguarding, violence or exploitation concerns.
- Community or online support has not been enough.

**Call 999 or go to A&E now** for chest pain, collapse, a seizure, severe difficulty breathing, signs of stroke, dangerous overheating, severe confusion, violent agitation, psychosis that creates immediate danger, or an immediate risk of suicide or serious self-harm. NHS 999 is for life-threatening emergencies. If help is urgent but not immediately life-threatening, use NHS 111 for direction.[6][7]

## How Insight Recovery Network can help

Insight Recovery Network can provide a confidential recovery assessment to clarify the pattern, risks, goals and appropriate level of support. Depending on the assessment, the next step may be local medical or NHS care, a structured online recovery programme, family support or treatment placement with a provider whose clinical capabilities match the person's needs.

An assessment is not an emergency service and does not replace diagnosis or medical treatment. Use emergency or NHS services for immediate risk.

## Frequently asked questions

### How do I know if I am addicted to cocaine?

Daily use is not required. Important signs include craving, repeated unsuccessful attempts to stop, using more or for longer than intended, and continuing despite health, relationship, financial or work harm. If cocaine is shaping decisions or repeatedly breaking your own limits, arrange a confidential assessment. Only a suitably qualified professional can diagnose a disorder, but you do not need to wait for the situation to become severe before asking for help.

### Is cocaine withdrawal dangerous?

Cocaine withdrawal is different from alcohol or benzodiazepine withdrawal and does not usually use the same medically assisted detox approach. It can still be clinically serious. Severe depression, suicidal thinking, psychosis, agitation or profound insomnia need prompt assessment. Emergency symptoms linked to recent cocaine use - including chest pain, seizure, collapse or stroke signs - require 999 or A&E. Risk depends on recent use, other substances and physical and mental health.

### How long does cocaine withdrawal last?

There is no single reliable timetable. A crash may bring fatigue, sleep change, low mood, appetite change and craving after use stops. The most intense symptoms may ease while sleep, motivation, mood or cue-triggered cravings continue to fluctuate. The practical question is not only duration but safety and support. Persistent depression, inability to function, psychosis or suicidal thoughts should be assessed rather than managed by waiting for a deadline.

### Is there a medication for cocaine addiction?

There is no routine substitute medicine for cocaine dependence comparable with opioid substitution treatment. UK guidance places psychosocial and non-pharmacological interventions at the centre of care. A prescriber may treat a separate condition or an acute symptom, but medicines do not replace recovery work and can carry interaction risks if cocaine use continues. Always tell the prescriber about cocaine, alcohol, other drugs and current medication.

### Do I need residential rehab for cocaine addiction?

Not necessarily. Most treatment begins in the community. Residential care may be considered when use is severe or persistent, the home environment is unsafe, previous community treatment has not helped, or significant physical, mental health or social problems require intensive support. A placement decision should follow assessment and examine clinical capability, medical arrangements and aftercare rather than choosing on price or accommodation alone.

### Can online recovery support help with cocaine addiction?

Online support can provide structure, therapeutic contact, education, accountability and relapse planning while a person remains at home. It may fit when there is no acute medical or psychiatric emergency and the home environment is sufficiently safe. It is not a replacement for emergency care, medically managed withdrawal from another substance or inpatient mental health treatment. Suitability should be assessed and reviewed if risk changes.`.trim(),
  },
  {
    slug: "addiction-detox-uk",
    title: "Addiction Detox UK: Safety, Settings and Next Steps",
    excerpt: "A practical UK guide to withdrawal safety, detox settings, professional assessment and the continuing treatment needed afterwards.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-08-11",
    readingTime: 19,
    category: "Treatment Options",
    image: "/addiction-detox-uk-treatment-navigation-hero.webp",
    ogImage: "/addiction-detox-uk-treatment-navigation-og.webp",
    imageAlt: "Adult arriving at a calm treatment setting with a backpack.",
    seoTitle: "Addiction Detox UK: Safety, Settings and Next Steps | IRN",
    metaDescription: "Understand when addiction detox needs medical support, how community, residential and inpatient settings differ, and what should happen afterwards.",
    ogTitle: "Addiction Detox UK: Safety, Settings and Next Steps",
    ogDescription: "A practical guide to withdrawal safety, detox settings and continuing addiction treatment in the UK.",
    publishedStatus: "published",
    medicalWebPage: true,
    supportingImages: [
      {
        afterHeading: "What a detox assessment should cover",
        src: "/addiction-detox-assessment-uk.webp",
        alt: "Addiction professional and adult reviewing a confidential detox assessment together.",
        caption: "A detox assessment considers withdrawal history, current use, physical and mental health, other substances, support and the safety of the proposed setting.",
      },
      {
        afterHeading: "Why aftercare matters",
        src: "/recovery-plan-after-addiction-detox.webp",
        alt: "Adult planning ongoing recovery support with a professional after detox.",
        caption: "Continuing treatment, practical support and relapse planning should be arranged before detox ends.",
      },
    ],
    faq: [
      {
        "question": "Is addiction detox the same as rehab?",
        "answer": "No. Detox manages the withdrawal phase. Rehabilitation and continuing addiction treatment address craving, behaviour, mental and physical health, relationships, daily structure and relapse prevention. Some residential programmes include both detox and rehabilitation, while others accept people only after withdrawal has been completed elsewhere. Ask exactly which clinical services a provider delivers."
      },
      {
        "question": "Which withdrawals can be dangerous?",
        "answer": "Alcohol withdrawal and benzodiazepine withdrawal can cause serious complications, including seizures and severe confusion. Abruptly stopping other dependence-forming medicines can also cause significant problems. Opioid withdrawal is usually less medically dangerous by itself, but dehydration, other illness and loss of tolerance create important risks. Any severe psychiatric symptoms or multiple-substance use require careful assessment."
      },
      {
        "question": "Can I detox from alcohol at home?",
        "answer": "Some medically assisted alcohol withdrawals are delivered in the community after assessment, with prescribed treatment, monitoring and support. This is not the same as stopping suddenly alone. A history of seizures or delirium, severe dependence, important physical or mental illness, multiple substances, pregnancy, limited support or an unsafe home may point to inpatient or another specialist setting.[1][5]"
      },
      {
        "question": "How long does addiction detox take?",
        "answer": "There is no single detox timeline. It varies with the substance, dose, duration, metabolism, health, other medicines and chosen regimen. Some acute withdrawal phases are measured in days, while withdrawal from prescribed dependence-forming medicines may require a gradual reduction over much longer. A provider should explain the expected process without promising an exact symptom-free date."
      },
      {
        "question": "Can an online recovery programme provide detox?",
        "answer": "An online programme can support motivation, education, recovery planning and continuing care, but it cannot replace medical assessment, prescribing, physical observations or emergency treatment. It may be appropriate before admission or after a person is medically stable, provided risks can be managed and local medical support is available."
      },
      {
        "question": "What should happen after detox?",
        "answer": "Aftercare should begin before detox ends. It may include psychological treatment, recovery medication where indicated, online or community support, residential rehabilitation, family work, mutual aid, physical and mental healthcare and a written relapse plan. For opioid detox, reduced tolerance and overdose prevention require particular attention.[1][2][4]"
      }
    ],
    sources: [
      {
        "title": "Alcohol-use disorders: diagnosis, assessment and management",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg115/chapter/Recommendations"
      },
      {
        "title": "Drug misuse in over 16s: opioid detoxification",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/CG52/chapter/recommendations"
      },
      {
        "title": "Alcohol-use disorders: physical complications",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"
      },
      {
        "title": "Drug misuse and dependence: UK guidelines on clinical management",
        "publisher": "Department of Health and Social Care",
        "url": "https://www.gov.uk/government/publications/drug-misuse-and-dependence-uk-guidelines-on-clinical-management"
      },
      {
        "title": "Clinical guidelines for alcohol treatment",
        "publisher": "Department of Health and Social Care",
        "url": "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment"
      },
      {
        "title": "Medicines associated with dependence or withdrawal symptoms",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/ng215/chapter/Recommendations"
      },
      {
        "title": "Drug misuse in over 16s: psychosocial interventions",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/CG51/chapter/recommendations"
      },
      {
        "title": "When to call 999",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/"
      },
      {
        "title": "Get help for your symptoms",
        "publisher": "NHS 111",
        "url": "https://111.nhs.uk/"
      }
    ],
    content: `**Concise answer:** Addiction detox is the planned management of withdrawal when someone reduces or stops alcohol, an illicit drug or a dependence-forming medicine. The right approach depends on the substance, level of dependence, previous withdrawal, physical and mental health, other substances, pregnancy, home support and immediate risk. Alcohol and benzodiazepine withdrawal can cause serious complications, while opioid detox reduces tolerance and can raise overdose risk if use resumes. Detox should therefore follow an individual clinical assessment and be connected to continuing addiction treatment, not treated as a stand-alone cure.[1][2][3][4]

If you are dependent on alcohol, benzodiazepines, opioids or another prescribed medicine, do not make a sudden change based only on information online. Speak to a doctor, prescriber or specialist treatment service. Call 999 or go to A&E for a seizure, severe confusion, hallucinations, collapse, severe breathing difficulty, chest pain, extreme agitation, suspected overdose or immediate risk of suicide or serious self-harm. Insight Recovery Network is not a regulated healthcare provider, emergency service or medical detox service. We do not diagnose, prescribe or provide medical detox.

## Key takeaways

- Detox manages withdrawal; it does not by itself treat the psychological, social and behavioural drivers of addiction.
- The safest setting is chosen through assessment, not by preference, price or the promise of a rapid detox.
- Alcohol and benzodiazepine withdrawal can become medically dangerous. Dependence-forming medicines should not usually be stopped abruptly.
- Opioid withdrawal is not usually life-threatening in a healthy adult, but dehydration, co-occurring illness and loss of tolerance create important risks, including overdose after relapse.
- Cocaine, other stimulant and cannabis withdrawal usually require supportive and psychological care rather than a substitute medicine, but severe depression, psychosis or suicide risk needs urgent assessment.
- Community, residential and specialist inpatient withdrawal services provide different levels of monitoring. A residential setting is not automatically the same as a specialist medical inpatient unit.
- Continuing treatment and a relapse-prevention plan should be agreed before detox ends.

## Table of contents

1. What addiction detox means
2. Detox, stabilisation and recovery: the difference
3. Who should have a detox assessment?
4. How withdrawal differs by substance
5. What a detox assessment should cover
6. Community, residential or inpatient detox?
7. What happens before, during and after detox
8. Can addiction detox be done at home?
9. Choosing a detox provider in the UK
10. Practical steps to take now
11. Guidance for families
12. Why aftercare matters
13. When to seek professional or emergency help
14. Frequently asked questions

## What addiction detox means

Detoxification, usually shortened to detox, is the process of managing withdrawal as a substance or medicine leaves the body and the person stops or reduces use. In clinical care, detox is not simply “getting everything out of the system”. It is an active treatment process that may include assessment, prescribed medication, monitoring, symptom management, nutrition, hydration, psychological support and a plan for what follows.[2][3]

The word is used loosely online. A commercial “cleanse”, sauna, supplement, intravenous drip or very short retreat is not equivalent to evidence-based withdrawal management. The important questions are whether dependence is present, which complications are possible, who is clinically responsible, what monitoring is available and how rapidly care can escalate if the person's condition changes.

Some people do not need a formal medical detox. For example, a person using cocaine or cannabis may need structured support to stop, manage sleep or mood changes and address craving, without needing a substitute medicine. Someone with alcohol dependence, long-term benzodiazepine use or opioid dependence may need a medically supervised plan. The same label therefore covers very different clinical situations.

## Detox, stabilisation and recovery: the difference

These terms are related but should not be treated as interchangeable.

**Stabilisation** aims to reduce immediate risk and establish a safer, more predictable pattern. In opioid treatment, for example, a person may be stabilised on opioid substitution treatment rather than immediately moving towards abstinence. In an acute hospital, the priority may be to treat overdose, injury, infection or severe withdrawal before any planned detox decision is made.[2][4]

**Detox** manages the withdrawal phase. Its aim is to help a person reduce or stop safely, with discomfort and complications monitored and treated appropriately.

**Addiction treatment** addresses the wider condition. It may include motivational work, psychological therapy, medication where indicated, family support, physical and mental healthcare, mutual aid, recovery planning and practical help with housing, work, finances or relationships.

**Recovery** is the longer process of building safety, health, connection and a sustainable life. Abstinence may be an important goal, but detox alone does not create the routines, coping skills and support that protect it.

This distinction matters because a successful withdrawal can be followed by rapid relapse if nothing changes around the person. For opioids, a return to a previously tolerated amount after abstinence can cause overdose because tolerance has fallen.[2]

## Who should have a detox assessment?

A professional assessment is advisable whenever there may be physical dependence, previous difficult withdrawal, use of several substances, significant physical or mental-health problems, pregnancy, safeguarding concerns or uncertainty about what has been taken.

Seek assessment before stopping or sharply reducing if any of the following apply:

- daily or near-daily alcohol use with shaking, sweating, nausea, anxiety or a need to drink to feel normal
- a previous withdrawal seizure, delirium tremens, hallucinations or severe confusion
- regular benzodiazepine or Z-drug use, particularly at a high dose or over a long period
- opioid dependence, including heroin or non-medical use of prescription opioids
- use of methadone, buprenorphine or another prescribed dependence treatment
- several substances used together, especially alcohol, opioids and sedatives
- significant liver, heart, respiratory, neurological or other physical illness
- depression, psychosis, severe anxiety, self-harm or suicide risk
- pregnancy or the possibility of pregnancy
- an unsafe or unstable home, limited support, homelessness or risk from another person
- previous detox attempts followed by rapid relapse or overdose
- uncertainty about the substance, strength, dose or contamination.

An online questionnaire can help organise information and indicate that a fuller assessment is needed, but it cannot diagnose dependence, predict every complication or prescribe a withdrawal regimen.

## How withdrawal differs by substance

### Alcohol

Alcohol withdrawal may begin after a dependent person stops or substantially reduces drinking. Symptoms can include tremor, sweating, nausea, anxiety, poor sleep, agitation and a raised pulse. Severe withdrawal can involve seizures, hallucinations, delirium tremens and Wernicke's encephalopathy. UK guidance therefore recommends planned, medically assisted withdrawal for people who need it, with the setting and monitoring matched to severity and complexity.[1][3][5]

Community withdrawal can be appropriate after assessment when risks are manageable and reliable support and monitoring are available. Specialist inpatient care may be considered for severe dependence, a history of withdrawal seizures or delirium tremens, high risk of Wernicke's encephalopathy, important physical or psychiatric illness, multiple-substance dependence or inadequate safety at home.[1][5]

Do not use an article to choose your own alcohol-withdrawal medication or dose. Prescribing requires clinical assessment, attention to liver health, other medicines and regular review.

### Opioids

Opioid withdrawal can cause sweating, agitation, muscle and abdominal pain, nausea, vomiting, diarrhoea, insomnia and strong craving. It is often extremely distressing. Complications may arise through dehydration, co-occurring illness, use of other substances or attempts to relieve symptoms without medical advice.

NICE states that opioid detox should be a joint, informed decision with continued support and monitoring. Methadone or buprenorphine are first-line medicines in opioid detoxification, with the regimen chosen by a qualified prescriber according to dependence, stability, other substance use, health and setting. Ultra-rapid detoxification under general anaesthesia or heavy sedation should not be offered.[2]

The major post-detox risk is loss of tolerance. If a person returns to opioids, an amount previously used may now cause fatal overdose. Naloxone access, overdose education and continuing treatment should be discussed as part of the plan.[2][4]

### Benzodiazepines, Z-drugs and other dependence-forming medicines

Physical dependence can develop even when a medicine has been taken as prescribed. It is not the same thing as addiction, although the two can coexist. NICE advises against abrupt discontinuation of opioids, benzodiazepines, gabapentinoids, Z-drugs or antidepressants except in exceptional medical circumstances. Withdrawal is usually planned as a slow, stepwise reduction that can be adjusted to the person's response.[6]

The [benzodiazepine addiction and dependence guide](/resources/benzodiazepine-addiction) explains this distinction, urgent risks and the questions a medicine review should cover.

Someone considering a reduction should speak to the original prescriber, GP or another qualified clinician. The plan should consider dose, duration, previous withdrawal, concurrent medicines, physical and mental health, the original condition and the person's circumstances. This article intentionally does not provide a taper schedule because a generic schedule can be unsafe.

### Cocaine and other stimulants

There is no routine substitute medicine for cocaine dependence comparable with opioid substitution treatment. After heavy or repeated stimulant use, a person may experience fatigue, sleep disturbance, increased appetite, low mood, irritability, poor concentration and craving. Supportive care, risk assessment and psychosocial treatment are central.[4][7]

The “crash” should not be dismissed. Severe depression, suicidal thinking, psychosis, extreme agitation or prolonged inability to sleep needs prompt clinical assessment. Chest pain, a seizure, collapse, stroke symptoms or severe breathing difficulty after recent use is a medical emergency.

### Cannabis

Stopping frequent cannabis use can be followed by irritability, anxiety, sleep disturbance, vivid dreams, reduced appetite, restlessness and craving. These symptoms are usually managed with information, sleep and routine support, psychological strategies and treatment of any co-occurring mental-health needs. Severe anxiety, psychosis, suicide risk or inability to care for oneself requires urgent professional assessment.[4][7]

### More than one substance

Combined use changes the risk. Alcohol and benzodiazepines can both depress the central nervous system; opioids combined with alcohol or sedatives increase overdose risk. A person may also increase alcohol or another drug to cope with withdrawal. NICE recommends assessing dependence on other substances and deciding carefully whether withdrawals should occur separately, concurrently or after stabilisation.[2]

Do not assume that the substance causing the greatest concern is the one that should be stopped first. That is a clinical sequencing decision.

## What a detox assessment should cover

A good assessment connects the substance history with the whole person. It should usually explore:

- what is being used, how often, in what amount and by which route
- the time of the last use and whether the pattern is changing
- prescribed, over-the-counter and non-prescribed medicines
- alcohol and other substances that may affect withdrawal or overdose risk
- signs of current intoxication or withdrawal
- previous withdrawal, seizures, delirium, hallucinations, overdose and detox attempts
- current physical health, including relevant examination or tests where indicated
- mental health, self-harm, suicide risk, psychosis, cognition and sleep
- pregnancy and reproductive health where relevant
- nutrition, hydration and risk of vitamin deficiency
- home safety, housing, caring responsibilities and available support
- safeguarding, domestic abuse or exploitation concerns
- motivation, goals and preferences
- access to transport, medication supervision and urgent care
- what treatment and recovery support will follow detox.

Screening tools and tests can support clinical judgement but should not replace it. Information may need to be confirmed when the substance or level of tolerance is uncertain.[2][5]

## Community, residential or inpatient detox?

The least intensive setting is not always the safest, and the most intensive setting is not automatically the best. The purpose of assessment is to match clinical capability and support to the person's actual risks.

| Setting | May be suitable when | Important limitations or checks |
|---|---|---|
| Community-based medically assisted withdrawal | Risks are assessed as manageable; the person can engage with monitoring; medicines and support can be provided safely; the home environment and support are adequate | Confirm review frequency, named clinical responsibility, medication arrangements, out-of-hours escalation and what happens if symptoms worsen |
| Residential medically assisted withdrawal | The person needs a substance-free, structured environment or lacks adequate social support, while clinical risks remain within the service's capability | Residential care is not automatically a specialist inpatient medical unit; check staffing, prescribing, overnight monitoring, transfer pathways and regulated activity |
| Specialist inpatient withdrawal | Severe dependence, previous serious complications, complex physical or mental-health needs, multiple-substance dependence or other risks require specialist observation and rapid clinical response | Confirm admission criteria, medical and nursing cover, emergency capability, pharmacy arrangements and discharge planning |
| Acute hospital or emergency care | There is severe withdrawal, overdose, seizure, delirium, acute injury, serious illness, pregnancy-related concern or another urgent medical problem | The emergency problem comes first; planned addiction treatment and follow-up should be arranged once the person is stable |

The 2025 UK clinical guidelines for alcohol treatment distinguish specialist inpatient units from residential withdrawal settings. A comfortable bedroom, private room or 24-hour staff presence does not by itself establish that a service can manage complex withdrawal.[5]

An online recovery programme is not a medical detox service. It may support motivation and recovery planning before admission, or continuing recovery after a person is medically stable, but it should not replace prescribing, physical monitoring or emergency care.

## What happens before, during and after detox

### Before detox

The team should explain the expected process, benefits, limits and risks in language the person understands. A plan should identify the setting, responsible clinician, medicines if indicated, monitoring, practical arrangements, emergency pathway and continuing treatment. The person should have an opportunity to ask questions and involve a trusted family member or supporter where appropriate and consented.

Preparation may include physical observations, blood tests or other investigations, medicine reconciliation, arrangements for thiamine in alcohol treatment, overdose education and naloxone for opioid risk, and plans for children, work, transport or caring responsibilities. The exact requirements depend on the substance and clinical picture.[2][5]

### During detox

Monitoring should be proportionate to risk. Staff may assess symptoms, pulse, blood pressure, temperature, hydration, orientation, sleep, mood and medicine response. The plan should change if withdrawal is more severe than expected or new information emerges.

Prescribed medication should follow a clinical protocol and be reviewed by qualified professionals. Taking extra sedatives, alcohol, opioids or unreported medicines can alter the risk and must be disclosed. Honest disclosure is a safety issue, not a moral test.

### After detox

Discharge should not be the first time aftercare is discussed. The plan may include psychological treatment, medication to support relapse prevention where clinically appropriate, online or community recovery support, family work, peer support, physical and mental healthcare, housing or employment help, and clear action if craving or relapse occurs.[1][2][4]

For opioids, reduced tolerance and overdose prevention need explicit attention. For alcohol, continuing treatment may include psychosocial support and, after medical assessment, relapse-prevention medication. For prescribed medicines, follow-up may need to continue while symptoms settle or the reduction plan changes.[1][2][6]

## Substance-specific withdrawal and detox guides

The broad principles on this page do not replace substance-specific decisions. Use the relevant guide to prepare for a conversation with a qualified service:

- [Alcohol detox and withdrawal](/resources/alcohol-withdrawal-symptoms-when-you-need-medical-help), including medically assisted withdrawal and urgent warning signs
- [Benzodiazepine withdrawal](/resources/benzodiazepine-withdrawal), including the difference between prescribed dependence and addiction
- [Opioid detox and withdrawal](/resources/opioid-detox), including maintenance treatment, reduced tolerance and overdose prevention
- [Cocaine withdrawal](/resources/cocaine-withdrawal), including the crash, depression and psychological support
- [Ketamine withdrawal](/resources/ketamine-withdrawal), including the separate medical pathway for bladder, urinary or abdominal harm
- [Detox vs rehab](/resources/detox-vs-rehab), explaining how withdrawal management and continuing addiction treatment fit together.

These pages do not provide medication schedules or individual clearance to stop. Alcohol, benzodiazepine and opioid decisions require particular care, and combined use may change the safest sequence or setting.

## Can addiction detox be done at home?

Some planned withdrawals are delivered in the community and may take place while a person remains at home. That is different from deciding to stop suddenly without assessment, medication oversight or monitoring.

A home or community plan may be inappropriate when there is a history of severe withdrawal, significant physical or psychiatric illness, multiple-substance dependence, pregnancy, uncertain tolerance, high self-harm or overdose risk, an unsafe home, limited reliable support or difficulty attending reviews. The criteria vary by substance and service.[1][2][5]

Avoid these common shortcuts:

- using someone else's detox medication
- buying sedatives or opioid substitutes online
- estimating a taper from an internet forum
- drinking alcohol to treat withdrawal from another substance
- combining medicines to force sleep
- choosing “rapid” detox because it promises the shortest stay
- assuming a friend can manage seizures, delirium or overdose at home
- booking travel before clinical suitability and continuity of care are clear.

If cost, privacy, work or family duties make residential care difficult, explain those constraints during assessment. A clinician or treatment navigator may be able to compare safer community, outpatient, residential or inpatient options without minimising risk.

## Choosing a detox provider in the UK

Whether care is NHS-funded or private, ask what the service is clinically equipped to do. Useful questions include:

1. Who completes the assessment and who holds clinical responsibility?
2. Which substances and levels of complexity can the service safely manage?
3. Is prescribing provided directly, through another provider or not at all?
4. What medical and nursing cover is available during the day and overnight?
5. How are withdrawal symptoms monitored and documented?
6. What happens if the person becomes confused, has a seizure or needs hospital care?
7. How does the service manage physical illness, mental-health risk and multiple substances?
8. Which regulated activities does the provider deliver, and which regulator applies?
9. What is included in the quoted price, including assessment, medicines, tests, transfers and aftercare?
10. What continuing treatment begins during or immediately after withdrawal?
11. How are family communication, consent and confidentiality handled?
12. What is the plan if admission is delayed or the person relapses before arrival?

IRN's treatment-placement role is to help people compare suitable providers and admission routes after assessment. It does not replace the admitting service's medical assessment, prescribe detox medication or guarantee that a particular setting will accept a person.

## Practical steps to take now

1. **Do not make an abrupt change if dependence may be present.** Contact a GP, prescriber, NHS drug and alcohol service or qualified addiction clinician.
2. **Write down the current pattern.** Record substances, prescribed medicines, approximate amounts, frequency, last use and any recent change. Do not delay urgent help to make the list perfect.
3. **Record previous complications.** Include seizures, hallucinations, delirium, overdose, severe vomiting, self-harm, hospital admissions and previous detox attempts.
4. **Be open about combined use.** Alcohol, sedatives, opioids and stimulants can alter the plan even when one substance feels like the main problem.
5. **Identify immediate risks.** Consider suicidal thoughts, psychosis, pregnancy, serious illness, unsafe housing, domestic abuse and caring responsibilities.
6. **Arrange an assessment.** Ask which professional will decide the setting and how quickly it can occur.
7. **Plan the period after withdrawal.** Book follow-up, organise transport and support, reduce access to substances where safe, and agree what to do if craving or relapse occurs.
8. **Keep emergency directions separate from commercial decisions.** If severe symptoms occur, use 999 or A&E rather than waiting for a provider callback.

## Guidance for families

A family member can help with information, practical arrangements and continuity, but should not be expected to act as a detox nurse.

Choose a time when the person is not heavily intoxicated and describe specific observations without labels or threats. For example: “You were shaking this morning and needed a drink before work. I am worried that stopping suddenly might be unsafe. Can we arrange an assessment today?”

With the person's consent, share an accurate history of previous withdrawal, prescribed medicines, other substances, mental-health concerns and recent changes. Ask the assessing service what warning signs require emergency help and what the family should not attempt at home.

Set boundaries around money, driving, childcare, aggression and substances in the home. If children or vulnerable adults may be at risk, safeguarding takes priority over keeping the problem private. Families also deserve support for their own wellbeing, sleep, anxiety and decision-making.

If the person refuses help, you can still seek professional advice, prepare an emergency plan and avoid supplying unprescribed medication or alcohol as a withdrawal treatment.

## Why aftercare matters

Withdrawal may create a short period of abstinence, but the original triggers, habits, relationships and health needs remain. Early recovery can also involve disrupted sleep, low mood, anxiety, craving and a sudden loss of the routines built around substance use.

Continuing care should be matched to need. It may include structured online recovery, community treatment, residential rehabilitation, one-to-one therapy, group work, medication, family support, peer support and practical recovery planning. Online care may be particularly useful after medical stability when the person can engage safely at home, but it is not appropriate as the only response to acute withdrawal or unmanaged risk.

A relapse-prevention plan should identify warning signs, high-risk situations, people to contact, overdose precautions, medicine arrangements and the quickest route back to treatment. A lapse is a reason to reassess safety, not proof that detox or recovery has “failed”.

## When to seek professional or emergency help

Arrange prompt professional assessment when dependence may be present, withdrawal has occurred before, several substances are involved, prescribed medicines are being reduced, physical or mental health is unstable, pregnancy is possible, the home is unsafe or previous detox has not led to stable recovery.

Call 999 or go to A&E for:

- a seizure
- severe confusion, disorientation or hallucinations
- collapse, loss of consciousness or suspected overdose
- severe breathing difficulty, blue or grey lips, chest pain or stroke-like symptoms
- extreme agitation, violent behaviour or inability to keep the person safe
- persistent vomiting with marked drowsiness or signs of serious dehydration
- immediate danger of suicide or serious self-harm.

For urgent medical help that is not immediately life-threatening, use NHS 111. Do not drive someone yourself if they are unconscious, having a seizure, severely confused or may deteriorate on the journey.

## Frequently asked questions

### Is addiction detox the same as rehab?

No. Detox manages the withdrawal phase. Rehabilitation and continuing addiction treatment address craving, behaviour, mental and physical health, relationships, daily structure and relapse prevention. Some residential programmes include both detox and rehabilitation, while others accept people only after withdrawal has been completed elsewhere. Ask exactly which clinical services a provider delivers.

### Which withdrawals can be dangerous?

Alcohol withdrawal and benzodiazepine withdrawal can cause serious complications, including seizures and severe confusion. Abruptly stopping other dependence-forming medicines can also cause significant problems. Opioid withdrawal is usually less medically dangerous by itself, but dehydration, other illness and loss of tolerance create important risks. Any severe psychiatric symptoms or multiple-substance use require careful assessment.

### Can I detox from alcohol at home?

Some medically assisted alcohol withdrawals are delivered in the community after assessment, with prescribed treatment, monitoring and support. This is not the same as stopping suddenly alone. A history of seizures or delirium, severe dependence, important physical or mental illness, multiple substances, pregnancy, limited support or an unsafe home may point to inpatient or another specialist setting.[1][5]

### How long does addiction detox take?

There is no single detox timeline. It varies with the substance, dose, duration, metabolism, health, other medicines and chosen regimen. Some acute withdrawal phases are measured in days, while withdrawal from prescribed dependence-forming medicines may require a gradual reduction over much longer. A provider should explain the expected process without promising an exact symptom-free date.

### Can an online recovery programme provide detox?

An online programme can support motivation, education, recovery planning and continuing care, but it cannot replace medical assessment, prescribing, physical observations or emergency treatment. It may be appropriate before admission or after a person is medically stable, provided risks can be managed and local medical support is available.

### What should happen after detox?

Aftercare should begin before detox ends. It may include psychological treatment, recovery medication where indicated, online or community support, residential rehabilitation, family work, mutual aid, physical and mental healthcare and a written relapse plan. For opioid detox, reduced tolerance and overdose prevention require particular attention.[1][2][4]

## A measured next step

If you are unsure whether withdrawal may need medical support, a confidential recovery assessment can organise the history, identify risk flags and clarify which questions to take to a GP, prescriber, NHS treatment service or detox provider. It is not a diagnosis or emergency service.

When residential or specialist detox may be needed, assessment-led treatment placement can help compare provider capability, admission criteria, medical cover and aftercare. The admitting clinician must still confirm suitability.`.trim(),
  },
  {
    slug: "what-happens-in-residential-rehabilitation",
    title: "Residential Rehab UK: What Happens and Who It Helps",
    excerpt: "A practical guide to residential rehab in the UK, including suitability, assessment, detox, therapy, provider checks and continuing care.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-04-14",
    updatedDate: "2026-08-11",
    readingTime: 20,
    category: "Treatment Options",
    image: "/residential-rehab-uk-arrival-assessment-hero.webp",
    ogImage: "/residential-rehab-uk-arrival-assessment-hero-og.webp",
    imageAlt: "Adult discussing admission to a residential rehabilitation programme with a professional.",
    seoTitle: "Residential Rehab UK: What Happens and Who It Helps",
    metaDescription: "Learn what happens in residential rehab, who it may help, how detox and therapy differ, and how to compare safe, suitable UK treatment.",
    ogTitle: "Residential Rehab UK: What Happens and Who It Helps",
    ogDescription: "Understand residential rehab assessment, detox, therapy, daily structure, provider checks and continuing care in the UK.",
    publishedStatus: "published",
    medicalWebPage: true,
    supportingImages: [
      {
        afterHeading: "What treatment happens in residential rehab?",
        src: "/residential-rehab-uk-group-therapy-session.webp",
        alt: "Adults taking part in a facilitated group session at a residential rehab setting.",
        caption: "Residential programmes commonly combine structured group work with individual support and personalised recovery planning.",
      },
      {
        afterHeading: "What happens after residential rehab?",
        src: "/residential-rehab-aftercare-discharge-plan.webp",
        alt: "A resident and keyworker preparing an aftercare plan before leaving residential rehab.",
        caption: "Effective discharge planning connects residential treatment with ongoing clinical, recovery and practical support at home.",
      },
    ],
    faq: [
      {
        "question": "Does everyone with an addiction need residential rehab?",
        "answer": "No. Many people recover through NHS or private community treatment, outpatient therapy, structured day programmes, peer support or clinically appropriate online care. Residential treatment may be considered when someone needs greater intensity, a safer environment or 24-hour structure, or when significant co-occurring needs and previous treatment history make standard support insufficient. A comprehensive assessment should compare realistic settings rather than assuming the most intensive or expensive option is automatically best."
      },
      {
        "question": "Does residential rehab include detox?",
        "answer": "Sometimes, but not always. Detox is medical management of withdrawal; rehabilitation is the longer therapeutic and practical work of recovery. Some facilities are registered and staffed to provide both. Others admit people only after detox has been completed elsewhere. The provider should explain who assesses and prescribes, how symptoms are monitored, what emergency arrangements exist and whether detox days are included in the advertised programme length."
      },
      {
        "question": "How long is residential rehab in the UK?",
        "answer": "There is no single correct duration. Private packages are often marketed in blocks such as 28 days, while other programmes run for several months. UK guidance says length should be tailored to the person's needs and allow time to engage, work on change and prepare for community reintegration. Ask how the proposed duration was chosen, when it will be reviewed and what continuing care will start immediately afterwards."
      },
      {
        "question": "Can I use my phone or work during rehab?",
        "answer": "Policies vary. Some services restrict devices at first or limit work because outside demands can interfere with treatment; others allow planned access. Ask before admission about phones, laptops, visitors, confidentiality, urgent work contact and the clinical reason for restrictions. If maintaining limited work is essential, this should be considered during assessment. A residential programme may not be suitable if work requirements prevent meaningful participation."
      },
      {
        "question": "Can residential rehab treat mental-health problems too?",
        "answer": "It depends on the condition and the provider's capability. Co-occurring anxiety, depression, trauma symptoms or other needs should be assessed and included in planning, but the phrase “dual diagnosis” does not guarantee psychiatric staffing or specialist treatment. Ask who assesses mental health, how existing medication is managed, whether external teams remain involved and what happens if risk escalates. Acute or severe symptoms may require specialist or hospital care first."
      },
      {
        "question": "How do I check a private rehab in England?",
        "answer": "Search the Care Quality Commission for the provider and exact location, confirm which regulated activities it is registered to deliver and read its current assessment or inspection information. Then check staffing, detox capability, therapeutic model, safeguarding, medication management, complaints, outcomes definitions, costs and aftercare. CQC registration is essential where regulated activities are provided, but it does not replace an individual suitability assessment."
      },
      {
        "question": "What happens if someone wants to leave rehab early?",
        "answer": "A responsible provider should explore why, assess immediate risks and offer support without coercion. It should have a written process for medication, transport, information sharing, emergency concerns and rapid follow-up. Ask about this before admission. If a person leaves unexpectedly, relatives should not try to manage severe withdrawal, overdose risk or acute mental-health danger alone; contact the relevant clinician or emergency service."
      },
      {
        "question": "What should happen after residential rehab?",
        "answer": "Continuing care should be planned before discharge. It may include community addiction treatment, therapy or keyworking, medical and psychiatric follow-up, structured online support, peer networks, stable housing, family boundaries and a specific relapse-response plan. Named appointments and responsibilities are stronger than general advice to “attend meetings”. If the person returns to use, prompt reassessment is more useful than blame."
      }
    ],
    sources: [
      {
        "title": "Residential treatment and intensive structured day programmes",
        "publisher": "Department of Health and Social Care",
        "url": "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/14-residential-treatment-and-intensive-structured-day-programmes"
      },
      {
        "title": "Drug misuse in over 16s: psychosocial interventions",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg51/chapter/recommendations"
      },
      {
        "title": "Alcohol-use disorders: diagnosis, assessment and management",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg115/chapter/Recommendations"
      },
      {
        "title": "Drug addiction: getting help",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/"
      },
      {
        "title": "Alcohol-use disorder",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/conditions/alcohol-use-disorder/"
      },
      {
        "title": "Treatment and rehabilitation: substance misuse",
        "publisher": "Care Quality Commission",
        "url": "https://www.cqc.org.uk/category/service-types/treatment-and-rehabilitation-substance-misuse"
      }
    ],
    content: `**Concise answer:** Residential rehab is a live-in, structured programme for alcohol or drug problems. It may help when a person needs more support than standard community or online care can safely provide, particularly where there are complex physical, mental-health or social needs, an unstable home environment, repeated difficulty engaging with community treatment or a need for sustained 24-hour structure. It is not automatically the best option for everyone. A comprehensive assessment should determine the required setting, whether medically assisted withdrawal is needed and whether a particular provider can manage the person's risks and needs.

If alcohol, benzodiazepine or another drug may have caused physical dependence, do not advise sudden stopping on the basis of an online article. Withdrawal can require medical assessment and, in some situations, urgent care. Call 999 or go to A&E for a seizure, severe confusion, hallucinations, loss of consciousness, breathing difficulty or immediate danger.

## Key takeaways

- Residential rehabilitation is treatment delivered in a live-in setting; it is not simply accommodation, a retreat or a medical detox.
- UK guidance places residential treatment within a wider system of care and emphasises assessment, personalisation, trained staff, clinical governance and continuity after discharge.
- Greater complexity, an unsafe or unstable environment, significant co-occurring needs and insufficient benefit from less-intensive treatment can support consideration of residential care.
- Detox and rehabilitation are different. Some facilities provide both, while others require withdrawal to be completed in a different service.
- A familiar package length, attractive setting or high price does not prove that a programme is suitable or clinically strong.
- Provider checks should cover regulation, medical capability, staffing, therapies, safeguarding, complaints, costs and the discharge plan.
- Recovery continues after leaving. Follow-up care, housing, family preparation, medication arrangements and relapse-response steps should be organised before discharge.

## Table of contents

1. What residential rehab is
2. Who residential rehab may help
3. When another setting may be more appropriate
4. Assessment before admission
5. Detox versus rehabilitation
6. What happens after arrival
7. Therapy and a typical day
8. How long residential rehab lasts
9. Mental health, trauma and dual diagnosis
10. Family involvement
11. How to choose a residential rehab provider
12. Costs and written quotations
13. Leaving rehab and continuing care
14. Practical preparation
15. When to seek professional or emergency help
16. Frequently asked questions

## What is residential rehab?

Residential rehabilitation is an intensive addiction-treatment programme in which a person lives at the service for an agreed period. The residential setting creates separation from immediate access to alcohol or drugs, high-risk relationships and pressures at home. It also allows a predictable routine and closer support than most standard outpatient pathways can offer.

The accommodation is only one part of the intervention. A credible programme should have a clear therapeutic framework, a comprehensive assessment process, personalised treatment and recovery goals, trained staff, individual support, structured group work and arrangements for ongoing care. The Department of Health and Social Care's current UK alcohol treatment guidelines describe these as core elements of intensive structured programmes.

Programmes differ. Some use a therapeutic-community model; some are strongly influenced by 12-step recovery; others draw on cognitive behavioural, motivational, skills-based or integrative approaches. UK guidance does not identify one single model as superior in every case. What matters is whether the approach is explicit, evidence-informed, competently delivered and suitable for the individual.

Residential rehab is not the same as:

- **Medical detoxification:** the clinical management of withdrawal. Detox may happen before or at the beginning of rehabilitation, depending on need and provider capability.
- **Specialist inpatient care:** a medically led setting for people whose withdrawal or co-occurring health needs require a higher level of clinical provision.
- **Supported accommodation or sober living:** housing that may support recovery but may not deliver a regulated intensive treatment programme.
- **A wellness retreat:** wellbeing activities may complement treatment, but accommodation, exercise or relaxation alone do not constitute addiction rehabilitation.
- **Standard outpatient or online care:** structured support delivered while the person continues to live at home.

These distinctions matter because the word “rehab” is used loosely in marketing. Before paying a deposit, establish which services are actually delivered, which regulated activities are provided and who holds clinical responsibility.

## Who may benefit from residential rehab?

There is no single checklist that decides whether somebody “needs rehab”. Suitability depends on the whole picture: dependence and withdrawal risk, physical and mental health, other substance use, previous treatment, safeguarding, housing, relationships, motivation, practical responsibilities and personal preference.

NICE guidance says residential drug treatment may be considered for people seeking abstinence who have significant co-occurring physical, mental-health or social problems and who have not benefited from previous community-based psychosocial treatment. The 2025 UK alcohol treatment guidelines apply similar reasoning to alcohol dependence and describe residential treatment as an option for the minority who need intensive support, particularly people with complex needs.

Residential care may be worth assessing when one or more of the following apply:

- The home environment is unsafe, unstable or strongly organised around alcohol or drug use.
- The person needs sustained structure and support that cannot realistically be created at home.
- Previous community, outpatient or online treatment has not provided enough containment or engagement.
- There are significant co-occurring mental-health, physical-health or social needs that a suitable programme can coordinate safely.
- Homelessness, insecure housing, abuse, exploitation or severe isolation is making recovery harder.
- Repeated relapse or early treatment dropout suggests that a more intensive, contained programme should be considered.
- Multiple substances, prescribed medication or previous complicated withdrawal make coordinated assessment especially important.
- The person is seeking abstinence and understands the intensity of group living and structured treatment.

These are prompts for professional assessment, not automatic admission criteria. A residential setting can offer protection from some risks while introducing others, including disruption from family or work, exposure to group dynamics and a difficult transition home. The right question is not “Is rehab good?” but “Is this level and model of care a good match for this person now?”

## When might another setting be more appropriate?

Many people recover with community drug and alcohol services, outpatient therapy, primary care, peer support, structured day programmes or clinically governed online support. The NHS notes that drug treatment usually takes place while someone lives at home; residential rehabilitation may be considered when a more intensive option is appropriate.

Someone who is medically stable, has safe housing, can engage reliably and has a supportive home network may benefit from a less disruptive setting. An intensive day programme can provide substantial structure while allowing the person to practise skills in their real environment. Online recovery support may suit an assessed, medically stable person who needs planned groups, one-to-one input, accountability and recovery planning around work or family.

Residential rehab may also be the wrong destination if a person's immediate needs exceed what the facility can safely provide. Acute intoxication, severe withdrawal, serious physical illness, psychosis, immediate suicide risk or another crisis may require emergency, hospital or specialist psychiatric care first. A responsible provider should decline or delay an admission it cannot manage, rather than accepting everyone who can pay.

Practical barriers also deserve honest consideration. Leaving caring duties, employment or treatment from an existing clinical team may cause harm if transitions are poorly managed. Conversely, these responsibilities should not be used to minimise serious risk. Assessment should compare the likely benefits, limitations and safety of realistic options.

## Assessment before admission

A safe placement begins before travel. The referring professional and receiving provider should gather enough information to decide whether the service can meet foreseeable needs. A brief sales call is not a substitute for a clinical assessment.

Assessment commonly covers:

- current alcohol, illicit-drug and prescribed-medication use, including quantity, frequency and route;
- previous withdrawal symptoms, seizures, delirium, overdose or unsuccessful detoxification;
- physical health, pregnancy, nutrition, mobility, allergies and current medication;
- mental health, self-harm, suicide risk, cognitive needs and previous psychiatric care;
- other substances and the risks created by combinations;
- safeguarding, domestic abuse, exploitation, children and dependent adults;
- previous treatment, periods of improvement and reasons earlier plans broke down;
- housing, family, work, finances, legal issues and the likely discharge environment;
- communication, disability, culture, faith, sexuality, gender and other needs that affect safe participation;
- treatment goals, preferences, concerns and informed consent.

Information should be verified where appropriate and shared lawfully with consent. The provider may need GP summaries, medication records or input from mental-health and physical-health teams. Where severe co-occurring illness is present, UK guidance advises close working between the relevant services when deciding whether a placement is suitable and how ongoing care will be delivered locally.

The output should be a reasoned plan: the level of care, withdrawal setting if required, treatment goals, known risks, reasonable adjustments, family contact, medication arrangements and early discharge planning. Insight Recovery Network can help organise information, compare suitable pathways and coordinate contact, while the receiving provider remains responsible for its own admission decision and treatment.

## Detox and rehabilitation are different

Detoxification manages the body's withdrawal from alcohol or drugs. Rehabilitation addresses the psychological, behavioural, relational and practical work needed to support recovery. Completing detox does not by itself treat the patterns that maintain addiction; equally, someone cannot engage safely in an ordinary therapeutic programme if unstable withdrawal requires medical care.

Not everyone entering residential rehab needs detox. For those who do, the setting depends on the substance, level of dependence, previous withdrawal, physical and mental health, other drug use and available support. Some residential services are registered, staffed and equipped to provide medically assisted withdrawal. Others deliver rehabilitation only and require detox to be completed in the community, a specialist residential unit or hospital.

Ask the provider:

- Who completes the withdrawal assessment and who prescribes?
- Is detox delivered on site, under what registration and with what medical cover?
- How are symptoms monitored, including overnight?
- What happens if withdrawal becomes more severe than expected?
- Is there a direct transfer from detox into the therapeutic programme?
- Does the quoted programme length include detox days?

Alcohol withdrawal can be dangerous. The NHS advises people with withdrawal symptoms to obtain medical help before trying to stop and to call 999 or attend A&E for severe symptoms such as confusion, hallucinations or a seizure. Benzodiazepine and other withdrawal risks also require individual medical advice. Never use a standard online detox timetable as a personal prescription.

## What happens when someone arrives?

The exact admission process varies, but it should be calm, respectful and consistent with what was explained beforehand. The team will usually confirm consent, identity, medication, belongings, emergency contacts, communication permissions and immediate risks. A service that provides regulated clinical care may repeat observations or assessments to ensure that nothing important has changed since referral.

The first few days are an adjustment. A person may be exhausted, anxious, ashamed, ambivalent or unsettled by shared living. Good services do not expect immediate disclosure or emotional breakthroughs. They explain the routine, introduce a named keyworker, describe confidentiality and its limits, identify reasonable adjustments and agree achievable early goals.

Rules around phones, visitors, internet access, money, leave, smoking, prescribed medication and outside appointments differ. Restrictions should be explained before admission, including their therapeutic or safeguarding rationale. Ask how urgent family contact, employment matters and existing healthcare appointments will be managed.

If the person wants to leave early, staff should respond to the risks and reasons rather than relying on shame or threats. A responsible programme has a policy for planned and unplanned endings, including communication with relevant services, medication safety, transport and urgent follow-up.

## What treatment happens in residential rehab?

A programme should be personalised even when residents share a timetable. The mix may include:

### Structured group work

Facilitated groups can address motivation, cravings, triggers, emotional regulation, relationships, problem solving, relapse prevention and everyday recovery skills. Group participation is more than listening to lectures: it can provide feedback, practise communication and reduce isolation. Because group work can feel intense, staff need competence, supervision and clear processes for safety and confidentiality.

### Individual sessions and keyworking

One-to-one time allows the person to review goals, make sense of their own pattern of use and address issues that may not be suitable for a group. Ask whether advertised “one-to-one therapy” means psychotherapy, counselling, psychology, coaching or keyworking, how often it occurs and what qualifications the practitioner holds.

### Evidence-informed psychological interventions

Depending on the substance, formulation and co-occurring needs, treatment may draw on motivational approaches, cognitive behavioural methods, behavioural couples work, contingency management or other interventions supported by relevant guidance. No provider should claim that one branded method cures every addiction.

### Peer and mutual-aid support

Some programmes use 12-step fellowships; others introduce SMART Recovery, other peer networks or several choices. Mutual aid can add belonging and ongoing support, but the provider should be transparent about whether participation is encouraged or required.

### Psychoeducation and practical recovery work

Sessions may cover the effects of substances, sleep, nutrition, stress, relationships, high-risk situations, money, work and rebuilding a routine. Practical planning should connect insight with actions the person can sustain after leaving.

### Family work

With the person's consent and appropriate safeguards, family members may receive education, structured meetings or support to plan boundaries and communication. Family involvement should never force unsafe contact or ignore the needs of children and carers.

### Health and multi-agency coordination

Residential treatment does not replace necessary GP, psychiatric, hospital, social-care or safeguarding input. Providers should be clear about what they deliver directly and what requires an external service.

Exercise, mindfulness, creative activity and time outdoors may support wellbeing. They are valuable additions when appropriate, but should not be presented as substitutes for competent assessment and treatment.

## What does a typical day look like?

There is no universal timetable. A day may begin with a check-in or community meeting, followed by a therapeutic group, individual appointments on selected days, shared meals, recovery assignments, exercise or wellbeing activity, peer support and an evening review. Time is usually allocated for rest and personal tasks as well as formal treatment.

Structure can help re-establish sleep, meals, attendance and accountability. Yet a packed schedule is not evidence of quality on its own. Ask what each activity is intended to achieve, who leads it, whether attendance is recorded, how distress is managed and how the plan changes when progress or risk changes.

A sample day should be treated as an illustration, not a promise:

| Time | Possible activity | What to clarify |
|---|---|---|
| Morning | Check-in, breakfast, medication and community meeting | Who monitors health and how medication is managed |
| Late morning | Facilitated therapeutic group | Facilitator's role, model and supervision |
| Afternoon | Individual session, skills work or recovery planning | Frequency and whether it is therapy or keyworking |
| Early evening | Exercise, meal and practical responsibilities | Accessibility and reasonable adjustments |
| Evening | Peer meeting, reflection or quiet time | Staffing, support and crisis arrangements overnight |

## How long does residential rehab last?

There is no evidence-based “magic number” of days that suits everyone. The current UK alcohol treatment guidelines state that there is no clear evidence about the optimal length and that time in an intensive programme should be tailored to the person's needs. It must allow enough time to engage, build trust, work on change and prepare for reintegration.

Many private services market 28-day packages; other programmes run for several months. NICE specifically says that residential rehabilitation for alcohol-dependent people experiencing homelessness may be offered for a maximum of three months, alongside help to find stable accommodation. That recommendation should not be misread as a universal prescription for every person or substance.

Instead of buying a familiar duration, ask:

- What assessed goals support the proposed length?
- Is detox included in the total time?
- How often will progress, risk and suitability be reviewed?
- What would justify extending or shortening the stay?
- What happens financially if the plan changes?
- Which continuing-care appointments will be in place before discharge?

Length matters, but so do engagement, programme quality, fit and what happens next. A long placement without personalised treatment or a safe return plan is not automatically better than a shorter, well-coordinated pathway.

## Mental health, trauma and dual diagnosis

Anxiety, depression, trauma symptoms, ADHD, psychosis and other mental-health needs may affect substance use, risk and the ability to participate. “Dual diagnosis” is a broad term; it does not tell you whether a particular residential service has the staff or pathways to manage a specific condition.

Ask who assesses mental health, whether psychiatric input is routine or available only by external referral, how existing medication is managed and what happens in a crisis. If severe mental or physical illness is present, the provider should coordinate with existing teams and establish who remains clinically responsible.

Trauma-informed care is especially important in a shared, intensive environment. The UK alcohol guidelines warn that group work and communal living can trigger traumatic memories and recommend a trauma-informed treatment environment with appropriately trained staff. Trauma-informed does not mean immediately processing every traumatic experience. It means prioritising safety, choice, collaboration, trust, cultural awareness and avoiding practices that can retraumatise.

Residential care may offer stability that helps someone engage, but it is not a universal solution for every co-occurring condition. Some people need a more specialist integrated programme; others need stabilisation elsewhere before rehabilitation.

## How can families be involved?

Families often arrange enquiries, transport or funding, but the person receiving care retains rights to consent, privacy and involvement in decisions. Before admission, agree what the service may share, who can be contacted in an emergency and how safeguarding concerns will be handled. Confidentiality has legitimate limits, but it should not be described as absolute secrecy.

Useful family preparation includes:

- giving the assessment team accurate information about risk and previous withdrawal;
- understanding the provider's contact and visiting policy;
- planning care for children, dependants, pets, property and essential bills;
- avoiding promises, threats or financial arrangements that undermine informed consent;
- asking what education or family sessions are available;
- preparing boundaries and support for the return home;
- obtaining support for the family's own wellbeing, whether or not the person enters treatment.

Families should not be expected to become clinicians. Their role after discharge may involve encouragement, agreed boundaries and responding to warning signs, while qualified services manage treatment. Insight Recovery Network's family consultation can help relatives create a practical plan even when their loved one is uncertain or refusing help.

## How to choose a residential rehab provider

Comparison should begin with clinical fit and safety, not photographs. In England, check the provider and relevant regulated activities on the Care Quality Commission website. Read the current location profile, registration details and latest assessment or inspection reports. Scotland, Wales and Northern Ireland have their own national regulators. Current UK guidance says residential services should be registered with the relevant national body and comply with its standards.

Use this due-diligence framework:

| Area | Questions to ask | Why it matters |
|---|---|---|
| Assessment | Who assesses suitability, withdrawal and mental-health risk? | Confirms that placement follows need rather than ability to pay |
| Regulation | Which entity and location are registered for which activities? | Marketing names and regulated providers may not be identical |
| Detox | Is it delivered on site, by whom and with what escalation route? | Rehabilitation accommodation alone cannot manage every withdrawal risk |
| Staffing | Which professionals are present, on call and supervising treatment? | Job titles do not always reveal qualifications or availability |
| Programme | What is the therapeutic model and evidence base? | A clear rationale helps people make an informed choice |
| Personalisation | How are individual goals and progress reviewed? | Shared timetables still require individual care planning |
| Mental health | What can the service manage and when is external care needed? | “Dual diagnosis” claims may conceal limited capability |
| Safeguarding | How are abuse, self-harm, children and vulnerable adults managed? | Residential settings have responsibilities beyond therapy |
| Medication | Who stores, administers and reviews prescribed medicine? | Safe continuity and governance are essential |
| Family | What can relatives expect, subject to consent? | Prevents confusion and unsafe promises |
| Aftercare | Who arranges appointments, housing and relapse-response steps? | Transition risk begins before the person leaves |
| Outcomes | How are completion, improvement, relapse and follow-up defined? | “Success rate” claims are meaningless without method and timeframe |
| Complaints | How can concerns be raised and escalated? | A transparent service welcomes scrutiny |
| Cost | What is included, excluded and refundable? | Allows fair comparison of total likely cost |

### Warning signs in rehab marketing

Be cautious if a service:

- guarantees a cure, permanent abstinence or a near-perfect success rate;
- recommends a placement before collecting meaningful clinical information;
- focuses on luxury, destination or celebrity associations while remaining vague about staff and treatment;
- uses “medical” language without naming the responsible regulated service or clinician;
- cannot explain overnight cover or emergency transfer arrangements;
- pressures for an immediate non-refundable payment without written terms;
- discourages independent regulator checks or refuses a written programme outline;
- claims to treat every substance and mental-health condition equally well;
- presents detox as a standard package unaffected by history or health;
- offers no credible plan for early discharge or continuing care.

Provider websites are a starting point. Confirm key claims in writing and, where possible, speak with the team responsible for clinical assessment rather than relying solely on an admissions representative.

## What does residential rehab cost?

Private costs vary by location, programme length, room type, staffing, detox needs, psychiatric input, therapies and aftercare. This pillar should not duplicate changing price ranges covered in IRN's dedicated UK rehab cost guide.

Ask for an itemised written quotation covering:

- assessment and admission;
- accommodation and meals;
- medical review, detox, medication and laboratory costs where relevant;
- frequency of individual therapy or keyworking;
- psychiatric or other specialist input;
- family sessions;
- transport and accompaniment;
- extensions, early departure and refund terms;
- discharge reports and aftercare;
- third-party appointments or prescriptions.

Price can affect comfort, privacy and staff access, but it does not determine suitability. The most expensive programme may still lack the clinical capability a person needs. Conversely, a lower-cost option should not be dismissed if it is regulated, well governed and appropriately matched.

## What happens after residential rehab?

Leaving can be as demanding as entering. The protected routine changes abruptly, while family tensions, work, housing problems, access to substances and familiar cues return. The UK alcohol guidelines identify a high risk of return to problematic drinking immediately after residential treatment and emphasise continuous care between residential and community services.

Discharge planning should begin early and include:

- named follow-up professionals and confirmed appointment dates;
- medication, physical-health and mental-health follow-up;
- structured individual, group, community or online recovery support;
- peer or mutual-aid options chosen by the person;
- a specific relapse-prevention and rapid-response plan;
- overdose-risk information where tolerance may have changed;
- stable accommodation and practical support with benefits, work or education;
- family roles, boundaries and emergency contacts;
- clear responsibility for sharing information and coordinating the plan;
- arrangements if the person leaves earlier than planned.

For a medically stable person, IRN's Online Recovery Programme may provide structured continuing support through groups, individual input, accountability and recovery planning. It is not a substitute for medical, psychiatric or emergency care. The correct aftercare mix should follow reassessment rather than being automatically added to every discharge.

Completion should not be framed as graduation from all support. Residential rehab is one phase in a longer recovery plan, and returning for help after a lapse should be treated as a reason for prompt reassessment rather than shame.

## Practical preparation before admission

Once a provider has accepted the person, ask for a written arrival plan. Useful steps include:

1. Confirm the admission date, address, transport, arrival contact and what happens if travel is delayed.
2. Obtain the provider's written instructions about alcohol or drug use before arrival; do not improvise withdrawal.
3. Send accurate medication information and bring medicines in the required packaging.
4. Confirm what clothing, identification, payment method and personal items are allowed.
5. Arrange essential responsibilities such as children, pets, housing, bills and employment communication.
6. Agree who may receive updates and the limits of confidentiality.
7. Record existing clinical contacts and planned appointments.
8. Ask about phone, visitor, internet, leave and smoking policies.
9. Understand the deposit, full cost, extension and early-leaving terms.
10. Identify the first likely steps after discharge before treatment begins.

Preparation should improve safety and informed choice without creating unnecessary barriers. Current UK guidance specifically advises against standard requirements that delay access for everyone, such as insisting on a fixed number of pre-admission groups regardless of need.

## When to seek professional or emergency help

Seek assessment from a GP, local NHS drug and alcohol service or appropriately qualified addiction professional if substance use is affecting health, relationships, work or safety; attempts to reduce have repeatedly failed; withdrawal symptoms occur; mental health is deteriorating; or you are unsure which setting is appropriate. NHS drug and alcohol treatment can usually be accessed through a GP or local service, and private treatment is also available.

Do not wait for a routine rehab enquiry if there is immediate danger. Call 999 or attend A&E for a seizure, severe confusion, hallucinations, unconsciousness, breathing difficulty, suspected overdose, serious injury, immediate suicide risk or another medical emergency. Do not drive yourself to A&E.

Insight Recovery Network can help an individual or family clarify treatment questions, compare suitable private options and coordinate placement. It does not diagnose, prescribe, provide emergency care or replace the receiving provider's clinical assessment.

## Frequently asked questions

### Does everyone with an addiction need residential rehab?

No. Many people recover through NHS or private community treatment, outpatient therapy, structured day programmes, peer support or clinically appropriate online care. Residential treatment may be considered when someone needs greater intensity, a safer environment or 24-hour structure, or when significant co-occurring needs and previous treatment history make standard support insufficient. A comprehensive assessment should compare realistic settings rather than assuming the most intensive or expensive option is automatically best.

### Does residential rehab include detox?

Sometimes, but not always. Detox is medical management of withdrawal; rehabilitation is the longer therapeutic and practical work of recovery. Some facilities are registered and staffed to provide both. Others admit people only after detox has been completed elsewhere. The provider should explain who assesses and prescribes, how symptoms are monitored, what emergency arrangements exist and whether detox days are included in the advertised programme length.

### How long is residential rehab in the UK?

There is no single correct duration. Private packages are often marketed in blocks such as 28 days, while other programmes run for several months. UK guidance says length should be tailored to the person's needs and allow time to engage, work on change and prepare for community reintegration. Ask how the proposed duration was chosen, when it will be reviewed and what continuing care will start immediately afterwards.

### Can I use my phone or work during rehab?

Policies vary. Some services restrict devices at first or limit work because outside demands can interfere with treatment; others allow planned access. Ask before admission about phones, laptops, visitors, confidentiality, urgent work contact and the clinical reason for restrictions. If maintaining limited work is essential, this should be considered during assessment. A residential programme may not be suitable if work requirements prevent meaningful participation.

### Can residential rehab treat mental-health problems too?

It depends on the condition and the provider's capability. Co-occurring anxiety, depression, trauma symptoms or other needs should be assessed and included in planning, but the phrase “dual diagnosis” does not guarantee psychiatric staffing or specialist treatment. Ask who assesses mental health, how existing medication is managed, whether external teams remain involved and what happens if risk escalates. Acute or severe symptoms may require specialist or hospital care first.

### How do I check a private rehab in England?

Search the Care Quality Commission for the provider and exact location, confirm which regulated activities it is registered to deliver and read its current assessment or inspection information. Then check staffing, detox capability, therapeutic model, safeguarding, medication management, complaints, outcomes definitions, costs and aftercare. CQC registration is essential where regulated activities are provided, but it does not replace an individual suitability assessment.

### What happens if someone wants to leave rehab early?

A responsible provider should explore why, assess immediate risks and offer support without coercion. It should have a written process for medication, transport, information sharing, emergency concerns and rapid follow-up. Ask about this before admission. If a person leaves unexpectedly, relatives should not try to manage severe withdrawal, overdose risk or acute mental-health danger alone; contact the relevant clinician or emergency service.

### What should happen after residential rehab?

Continuing care should be planned before discharge. It may include community addiction treatment, therapy or keyworking, medical and psychiatric follow-up, structured online support, peer networks, stable housing, family boundaries and a specific relapse-response plan. Named appointments and responsibilities are stronger than general advice to “attend meetings”. If the person returns to use, prompt reassessment is more useful than blame.`.trim(),
  },
  {
    slug: "dual-diagnosis",
    title: "Dual Diagnosis: Addiction and Mental Health in the UK",
    excerpt: "Understand dual diagnosis, joined-up assessment and coordinated addiction and mental-health treatment options in the UK.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-08-11",
    readingTime: 18,
    category: "Mental Health",
    image: "/dual-diagnosis-uk-joined-up-assessment.webp",
    ogImage: "/dual-diagnosis-uk-joined-up-assessment-og.webp",
    imageAlt: "Adult discussing joined-up addiction and mental-health care with two professionals.",
    seoTitle: "Dual Diagnosis: Addiction and Mental Health UK",
    metaDescription: "Understand dual diagnosis, assessment and joined-up addiction and mental-health treatment in the UK, including care options and when to get help.",
    ogTitle: "Dual Diagnosis: Addiction and Mental Health in the UK",
    ogDescription: "A practical guide to co-occurring mental-health and substance-use needs, assessment, treatment and coordinated care.",
    publishedStatus: "published",
    medicalWebPage: true,
    supportingImages: [
      {
        afterHeading: "What should a dual-diagnosis assessment cover?",
        src: "/dual-diagnosis-assessment-symptom-timeline.webp",
        alt: "A clinician and adult reviewing the timeline of mental-health symptoms and substance use.",
        caption: "Looking at when symptoms and substance use began, changed or overlapped can make assessment more accurate.",
      },
      {
        afterHeading: "Choosing the right care setting",
        src: "/dual-diagnosis-online-recovery-continuing-care.webp",
        alt: "An adult taking part in structured online recovery support at home.",
        caption: "For some medically stable people, online recovery support can form one part of a wider coordinated care plan.",
      },
    ],
    faq: [
      {
        "question": "Is dual diagnosis an official diagnosis?",
        "answer": "No. It is a broad term for co-occurring mental-health and substance-use problems. Clinicians still assess the specific conditions, possible substance-induced symptoms, physical-health causes, medicines, risks and circumstances before recommending treatment."
      },
      {
        "question": "Can addiction cause mental illness?",
        "answer": "Alcohol and drugs can trigger, imitate or worsen some mental-health symptoms, and withdrawal can also affect mood, sleep, anxiety and perception. In other cases, mental-health symptoms predate substance use or both share risk factors. An individual assessment is needed before drawing conclusions about cause."
      },
      {
        "question": "Which should be treated first: addiction or mental health?",
        "answer": "Immediate safety comes first. After that, there is no universal order. Treatment may occur at the same time or in a planned sequence, but both needs should remain visible in one coordinated plan."
      },
      {
        "question": "Do I have to be abstinent before receiving mental-health help?",
        "answer": "Not as a universal rule. NICE says people with severe mental illness should not be excluded from mental-health services because of substance misuse. Intoxication may affect what can be assessed safely at a particular moment, but services should respond to urgent needs and arrange follow-up."
      },
      {
        "question": "Does dual diagnosis always require residential rehab?",
        "answer": "No. Many people are supported through community addiction treatment, primary care and mental-health services. Residential or specialist inpatient care may be appropriate when risks, withdrawal, housing or complexity cannot be managed safely at home. Assessment should determine the setting."
      },
      {
        "question": "Can dual diagnosis be treated online?",
        "answer": "Online recovery support may be useful for an assessed, medically stable person, particularly as part of continuing care. It is not a substitute for emergency treatment, medically managed withdrawal or in-person psychiatric care when these are required."
      },
      {
        "question": "Can family members be involved?",
        "answer": "Yes, usually with the person's consent. Families can contribute information and support a crisis or recovery plan. Confidentiality may limit what services disclose, but relatives can still share concerns and receive general guidance. Safeguarding duties continue to apply."
      },
      {
        "question": "What should a coordinated care plan include?",
        "answer": "It should identify the person's goals, current risks, interventions for both mental health and substance use, medication and withdrawal arrangements, the lead professional, responsibilities across services, information-sharing consent, crisis actions, practical needs and follow-up."
      }
    ],
    sources: [
      {
        "title": "Coexisting severe mental illness and substance misuse: assessment and management",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/cg120/chapter/Recommendations"
      },
      {
        "title": "Coexisting severe mental illness and substance misuse: community services",
        "publisher": "NICE",
        "url": "https://www.nice.org.uk/guidance/ng58/chapter/recommendations"
      },
      {
        "title": "People with co-occurring mental health conditions",
        "publisher": "Department of Health and Social Care",
        "url": "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/18-people-with-co-occurring-mental-health-conditions"
      },
      {
        "title": "Adult substance misuse treatment statistics 2024 to 2025",
        "publisher": "Office for Health Improvement and Disparities",
        "url": "https://www.gov.uk/government/statistics/substance-misuse-treatment-for-adults-statistics-2024-to-2025/adult-substance-misuse-treatment-statistics-2024-to-2025-report"
      },
      {
        "title": "Urgent support",
        "publisher": "NHS",
        "url": "https://www.nhs.uk/every-mind-matters/urgent-support/"
      }
    ],
    content: `**Concise answer:** Dual diagnosis usually means that a person has both a mental-health condition and harmful alcohol or drug use. It is a descriptive term, not a single diagnosis. Good care assesses both areas together, deals with urgent risks first and coordinates evidence-based treatment rather than assuming one problem must be completely resolved before the other can be addressed. The right pathway may involve primary care, mental-health services, community addiction treatment, medically supported withdrawal, residential care or structured online support, depending on the person's needs and safety.

For the broader relationship between symptoms, substance use, assessment and routes into care, read the complete guide to [mental health and addiction](/resources/mental-health-and-addiction).

If someone is in immediate danger, has attempted suicide, is severely confused, is having a seizure, cannot be woken, has serious breathing difficulty or is experiencing another medical emergency, call 999 or go to A&E. In England, urgent mental-health support that is not an emergency is available through NHS 111 online or by calling 111 and selecting the mental-health option.

## Key takeaways

- Dual diagnosis describes co-occurring mental-health and substance-use needs; it does not tell you which conditions are present or what treatment is required.
- Symptoms can have several explanations. Substance effects, withdrawal, sleep loss, prescribed medicines and physical illness can resemble or worsen mental-health symptoms.
- UK guidance supports a “no wrong door” approach: people should not be excluded from appropriate mental-health care because they use substances, or from addiction treatment solely because they have mental-health needs.
- Immediate safety and withdrawal risks come first, but there is no universal rule that addiction or mental health must always be treated before the other.
- A strong plan identifies who is leading, what each service will provide, how information will be shared and what happens if risk or symptoms worsen.
- Online assessments can prompt reflection but cannot diagnose a mental-health or substance-use disorder.
- Residential or online treatment is not automatically suitable. Placement should follow a comprehensive assessment and confirmation that the receiving provider can meet the person's needs.

## Table of contents

1. What dual diagnosis means
2. How common co-occurring needs are
3. Why addiction and mental health overlap
4. Signs that a joined-up assessment may help
5. What a dual-diagnosis assessment covers
6. Which condition should be treated first?
7. What integrated and coordinated care looks like
8. Treatment options
9. Choosing the right care setting
10. Common mental-health presentations
11. Trauma-informed care
12. Family and carer support
13. How to compare providers
14. Practical next steps
15. When to seek professional or emergency help
16. Frequently asked questions

## What does dual diagnosis mean?

In UK addiction and mental-health services, “dual diagnosis” usually refers to a mental illness occurring alongside harmful or dependent use of alcohol, illicit drugs or medicines. NICE notes that the term is also used differently in some settings, so it is better to state the actual needs than rely on the label alone.

The phrase covers very different situations. One person may have depression and alcohol dependence. Another may experience psychosis while using cannabis or stimulants. Someone else may have post-traumatic stress symptoms, prescribed-medicine dependence and severe sleep disruption. Their risks, care teams and treatment plans should not be assumed to be the same.

Dual diagnosis is therefore not a diagnosis in its own right. A clinician still needs to assess whether the person meets criteria for a particular mental-health condition and substance-use disorder, whether symptoms may be substance-induced, and whether a physical-health or medication issue could be contributing.

People may also hear “co-occurring conditions”, “coexisting mental illness and substance misuse” or “comorbidity”. “Co-occurring needs” is often the clearest, least labelling description. This guide uses “dual diagnosis” because people search for it, while recognising that care must be individual.

## How common are co-occurring needs?

Co-occurring needs are common within treatment services, but figures must be interpreted carefully. The Office for Health Improvement and Disparities reported that 74%, or 124,763, of adults starting drug and alcohol treatment in England in 2024–25 said they had a mental-health treatment need. Of those reporting such a need, 22% were not receiving treatment for it.

These are service data, not an estimate of the proportion of everyone in the UK who uses alcohol or drugs. The measure is also a reported treatment need, not proof of a specific psychiatric diagnosis. Its value is practical: addiction services should expect mental-health needs to be present, ask about them and build reliable links with appropriate care.

## Why can addiction and mental-health problems overlap?

There is rarely one simple explanation. For some people, mental-health symptoms existed before substance use became problematic. Alcohol or drugs may initially seem to reduce anxiety, numb traumatic memories, increase energy or help with sleep. Short-term relief can reinforce use even when the longer-term effect is worsening mood, anxiety, sleep, relationships or safety.

For others, heavy or prolonged use contributes to mental-health symptoms. Intoxication, withdrawal and repeated cycles of use can affect sleep, judgement, mood, perception and behaviour. Stimulants may be associated with severe anxiety, agitation or paranoia; alcohol can worsen low mood and impulsivity; cannabis can be associated with psychotic experiences in some people. This does not establish the cause in an individual case.

Shared factors can increase vulnerability to both problems. These may include trauma, social isolation, poverty, unstable housing, chronic pain, neurodevelopmental differences, family history and exposure to violence or exploitation. Physical illness and prescribed medicines can complicate the picture further.

The relationship can also change over time. A person may begin using for one reason and continue because dependence, withdrawal avoidance, habit, social context and reduced alternatives now maintain the pattern. Good formulation asks, “What is happening for this person now?” rather than forcing their experience into a single story.

## Signs that a joined-up assessment may help

A coordinated assessment is worth considering whenever mental-health symptoms and alcohol or drug use appear to affect each other, create risk or make it hard to benefit from treatment.

Possible indicators include:

- anxiety, depression, trauma symptoms, mania, paranoia, hallucinations or severe mood changes alongside substance use;
- using alcohol or drugs to cope with sleep, distress, memories, attention, social situations or prescribed-medication effects;
- mental-health symptoms that intensify during intoxication, a “comedown” or withdrawal;
- repeated relapse after an improvement in mental health, or repeated mental-health crises after a return to substance use;
- self-harm, suicidal thoughts, overdose, severe impulsivity, aggression, exploitation or neglect;
- missing appointments or being passed between services because needs are considered “too complex”;
- several prescribed and non-prescribed substances, especially where interactions or withdrawal may be dangerous;
- unstable housing, domestic abuse, caring responsibilities or legal problems that affect safety and engagement;
- previous diagnoses made during a crisis that have not been reviewed when the person was more stable.

None of these signs proves a dual diagnosis. They show why separate, disconnected conversations can miss important information.

## What should a dual-diagnosis assessment cover?

A comprehensive assessment is a process, not a score. It may require more than one appointment and information from the person, family or carers with consent, GPs, pharmacists, mental-health teams and addiction services.

### Immediate safety

The first task is to identify urgent needs: overdose, severe intoxication, dangerous withdrawal, psychosis, mania, suicidal intent, self-harm, violence, abuse, neglect, exploitation, pregnancy-related risk or acute physical illness. Safety planning and emergency care should not wait for a perfect diagnostic picture.

### Substance use and medicines

The assessor should ask what is being used, how much, how often and by which route; when use last occurred; what happens when it stops; and whether there have been seizures, delirium, overdose or previous complicated withdrawal. This includes alcohol, illicit drugs, over-the-counter products and prescribed medicines. A medication review can identify interactions, missed doses, duplication and drugs that should not be stopped suddenly.

### Mental and physical health

Assessment should explore mood, anxiety, sleep, trauma, psychotic experiences, attention, cognition, eating, impulsivity and previous diagnoses or treatment. Physical health, pain, nutrition, liver and cardiovascular risks, infections and neurological symptoms may need attention. The aim is not to attribute every symptom to either “mental health” or “addiction” too early.

### A timeline and formulation

When did each symptom and pattern of use begin? What changes during intoxication, withdrawal and periods of reduced use? What makes things better or worse? A shared timeline can help distinguish possibilities and identify maintaining factors. NICE advises reviewing diagnoses made during crisis and considering the individual relationship between substance use, symptoms, emotions, behaviour and social circumstances.

### Daily life and wider needs

Housing, relationships, finances, employment, caring duties, culture, communication, disability, safeguarding and legal concerns can determine whether a plan is realistic. The person’s strengths, preferences, goals and previous periods of improvement matter as much as problems.

The outcome should be a formulation and care plan, not simply two labels. Insight Recovery Network's self-assessments can help a person organise concerns before a conversation, but they do not diagnose. Any receiving treatment provider must complete its own clinical and admission assessment.

## Which condition should be treated first?

There is no blanket rule. The immediate priority is whatever presents the greatest current risk. A medical emergency, severe withdrawal, acute psychosis or imminent suicide risk requires urgent stabilisation. That does not mean the other area should disappear from the plan.

After immediate risks are addressed, care may be simultaneous, closely coordinated or deliberately sequenced. The choice depends on the relationship between symptoms and use, the person's ability to engage, treatment risks, available expertise and preferences. For example, medically supported alcohol withdrawal may be needed before someone can participate fully in psychological work, while ongoing mental-health treatment and medication review continue throughout.

Current UK alcohol-treatment guidance recommends one overarching plan that states which interventions are needed, who will deliver them and whether they will happen at the same time or in sequence. It also warns against assuming that successful treatment of one condition will automatically resolve the other.

“Come back when you are abstinent” is not an adequate response to every mental-health need. NICE says people with severe mental illness should not be excluded from mental-health care because of substance misuse. Equally, a mental-health diagnosis should not by itself bar someone from suitable alcohol or drug treatment.

## What does integrated or coordinated care look like?

Integrated care does not necessarily mean one building or one clinician provides everything. It means the work fits together around the person.

A credible plan usually includes:

- a named lead professional or care coordinator where complexity requires one;
- shared goals that cover mental health, substance use, physical health and daily life;
- clear responsibilities, referral routes and communication arrangements;
- evidence-based interventions for both sets of needs;
- medication and withdrawal-risk review by appropriately qualified professionals;
- a crisis and contingency plan covering suicide, self-harm, overdose, relapse and loss of contact;
- safeguarding, housing and family or carer needs where relevant;
- regular review as symptoms, use and circumstances change;
- a transition and follow-up plan before discharge from any intensive setting.

This is sometimes described as a “no wrong door” approach. A person should receive help with immediate needs wherever they first present and be actively connected with other services, rather than handed a telephone number and expected to coordinate a complex system alone.

For people with severe mental illness, NICE places particular responsibility on secondary mental-health services to lead assessment and care planning while drawing on substance-misuse expertise. For less severe or different combinations of need, leadership may sit elsewhere. What matters is that ownership is explicit.

## What treatments may be included?

Treatment should follow the identified conditions and risks. There is no single “dual diagnosis therapy”. A plan may combine several components.

### Addiction treatment

This may include medically assisted withdrawal where required, motivational work, cognitive behavioural approaches, relapse-prevention skills, harm-reduction planning, contingency management for some drug problems, peer support and medication used within relevant clinical guidance. Treatment goals may involve abstinence or risk reduction, depending on need and the service.

### Mental-health treatment

Appropriate care may include psychological therapy, medication, social interventions and specialist mental-health follow-up. The specific treatment depends on a proper diagnosis, severity, current substance effects, risks and preferences. Prescribing decisions belong to a qualified clinician with access to the full picture.

### Dual-focused work

Some trained practitioners deliver interventions that explicitly explore how symptoms and substance use interact. This can include recognising triggers across both areas, developing alternatives to using substances for emotional regulation, and building one relapse plan for mental-health deterioration and renewed use. UK guidance notes that evidence on the best model is still developing, so a provider should not present one branded method as universally effective.

### Practical and social support

Housing, debt, benefits, domestic safety, relationships, education and work are not side issues. Unmet needs can destabilise both mental health and recovery. Occupational, social-care and voluntary-sector support may therefore be essential parts of treatment.

## Choosing the right care setting

The least intensive setting that can safely and effectively meet the person's needs is often preferable, but “least intensive” should not mean inadequate.

### Emergency and hospital care

Immediate danger, serious physical illness, severe intoxication or withdrawal, acute psychosis, mania or high suicide risk may require emergency, acute medical or psychiatric care. A private rehabilitation or online programme is not a substitute for emergency services.

### Community and outpatient care

Many people receive addiction and mental-health support while living at home. This can work well when housing is safe, risks can be managed and the person can engage with appointments. Coordination between GP, community addiction treatment and mental-health services may be needed.

### Residential or specialist inpatient care

A live-in setting may be considered when risks, withdrawal, an unstable environment, repeated difficulty engaging or complex co-occurring needs cannot be managed adequately in the community. The provider must be able to manage the actual mental-health presentation; a vague claim to offer “dual diagnosis treatment” is not enough.

### Online recovery support

Structured online support can reduce travel barriers and help a medically stable person practise recovery in everyday life. It may include groups, one-to-one work, planning and accountability. It is not suitable as the sole response to an emergency, severe withdrawal or needs requiring in-person medical or psychiatric care. Insight Recovery Network's Online Recovery Programme should be considered as one potential component after suitability screening, not as universal dual-diagnosis treatment.

Treatment placement can help compare capabilities and organise information, but the receiving provider remains responsible for clinical assessment, admission and care.

## Common mental-health presentations

The following examples illustrate why assessment matters; they are not tools for self-diagnosis.

### Depression and anxiety

Low mood, worry, panic, poor sleep and reduced motivation can precede, follow or be worsened by alcohol and drug use. Withdrawal and comedowns can also cause substantial mood and anxiety symptoms. Clinicians consider severity, duration, timing, safety and how symptoms change with stability.

### PTSD and trauma-related symptoms

Alcohol or drugs may become a way of managing intrusive memories, hyperarousal, numbness or sleep problems. Trauma can also increase vulnerability to exploitation and disengagement from services. Care should establish safety and coping before intensive trauma processing, with therapy delivered by someone competent to manage both trauma and substance-use risk.

### ADHD

Restlessness, impulsivity, poor concentration and sleep disruption can overlap with substance effects and other conditions. An ADHD diagnosis requires a specialist assessment, including evidence about longstanding symptoms and impairment. Online screening alone is not diagnostic.

### Bipolar disorder and psychosis

Mania, paranoia, hallucinations and disorganised thinking may require urgent specialist assessment. Substances can trigger or worsen these experiences, but clinicians should not assume that all symptoms are substance-induced. NICE provides specific guidance for psychosis with coexisting substance misuse and for severe mental illness in community care.

## Trauma-informed care without assumptions

Trauma-informed care is an approach to safety, trust, choice, collaboration and avoiding retraumatisation. It does not mean assuming that every person has trauma, requiring disclosure or beginning trauma-processing therapy immediately.

A provider should explain confidentiality and its limits, ask permission, minimise unnecessary repetition of distressing histories and offer choice where possible. Staff should understand that missed appointments, mistrust or emotional reactions may have several meanings. At the same time, trauma should not be used as a catch-all explanation that replaces diagnostic assessment.

When trauma-focused therapy is appropriate, timing and practitioner competence matter. Stabilisation of immediate risks, withdrawal and the living environment may be necessary. The plan should also address what happens if symptoms or urges intensify between sessions.

## How can families and carers help?

Families often hold valuable information about changes in sleep, mood, behaviour, medication and substance use. With the person's consent, they can contribute to assessment, crisis planning and relapse prevention. They may also need their own information and support.

Helpful actions include:

- describing observed changes without arguing over a diagnosis;
- asking directly and calmly about immediate safety where concerned;
- encouraging a comprehensive assessment rather than trying to choose the diagnosis at home;
- keeping emergency, medication and service-contact information accessible;
- agreeing boundaries around money, transport, children and the home;
- avoiding sudden confiscation or disposal of substances or medicines where withdrawal could be dangerous;
- seeking a family consultation for guidance on communication, boundaries and available pathways.

Confidentiality may limit what a professional can disclose without consent, but family members can still provide information and ask for general advice. Safeguarding concerns should be raised even when communication is difficult.

## How to compare dual-diagnosis providers

Ask for specific answers rather than relying on the phrase “dual diagnosis”. Useful questions include:

1. Which mental-health presentations can you safely assess and support, and which require another service?
2. Who completes the psychiatric, substance-use and withdrawal assessments?
3. Is a psychiatrist available, and if so, how and when?
4. Who leads the care plan and coordinates outside clinicians?
5. How are prescribed medicines verified, stored, reviewed and continued?
6. What happens if psychosis, suicide risk, severe withdrawal or another crisis develops?
7. Which therapies are offered, by whom and with what training and supervision?
8. How do you involve family or carers while respecting consent and confidentiality?
9. What regulated activities does the service provide, and who is the regulator?
10. What follow-up is arranged, and who is responsible after discharge?

Red flags include guaranteed cures, pressure to pay immediately, advice to stop psychiatric medication without the prescriber, no clear emergency pathway, unclear clinical leadership, claims to treat every presentation, or refusal to coordinate with existing services. A polished website is not evidence of clinical capability.

## Practical next steps

1. **Deal with immediate risk.** Use emergency or urgent NHS routes when needed.
2. **Write a simple timeline.** Note when mental-health symptoms, substance use, medication changes, crises and periods of improvement occurred.
3. **List all substances and medicines.** Include dose, frequency, last use and previous withdrawal or overdose.
4. **Arrange a comprehensive assessment.** Start with a GP, local NHS alcohol and drug service, current mental-health team or another suitably qualified service.
5. **Ask who owns the plan.** Identify the lead contact and what each service is expected to do.
6. **Compare settings by capability.** Consider safety, clinical provision, home environment, accessibility, family needs and continuity,not prestige.
7. **Plan for deterioration.** Record warning signs, emergency contacts, overdose or withdrawal risks and actions if appointments are missed.
8. **Review progress across both areas.** Improvement in one condition should not end monitoring of the other.

An IRN Recovery Assessment can help structure the initial conversation and identify questions for a treatment pathway. It does not provide a diagnosis. Where a more intensive or specialist setting may be needed, Treatment Placement can help compare provider capabilities, subject to each provider's own assessment and clinical responsibility.

## When to seek professional or emergency help

Seek a professional assessment when substance use and mental-health symptoms are persistent, worsening, affecting daily life, causing repeated crises or making previous treatment ineffective. Contact a GP, local NHS alcohol and drug service or current mental-health team. Do not wait for abstinence before mentioning serious mental-health symptoms.

Get urgent help if someone is experiencing suicidal thoughts with intent, severe agitation, rapidly worsening mania or psychosis, dangerous withdrawal, repeated overdose, serious self-neglect, violence or exploitation. In England, call NHS 111 and select the mental-health option for urgent help that is not an emergency.

Call 999 or go to A&E for immediate danger, an attempt at suicide, a seizure, severe confusion, loss of consciousness, serious breathing difficulty, suspected overdose with severe symptoms or another life-threatening emergency. Do not leave an unconscious person alone.

## Frequently asked questions

### Is dual diagnosis an official diagnosis?

No. It is a broad term for co-occurring mental-health and substance-use problems. Clinicians still assess the specific conditions, possible substance-induced symptoms, physical-health causes, medicines, risks and circumstances before recommending treatment.

### Can addiction cause mental illness?

Alcohol and drugs can trigger, imitate or worsen some mental-health symptoms, and withdrawal can also affect mood, sleep, anxiety and perception. In other cases, mental-health symptoms predate substance use or both share risk factors. An individual assessment is needed before drawing conclusions about cause.

### Which should be treated first: addiction or mental health?

Immediate safety comes first. After that, there is no universal order. Treatment may occur at the same time or in a planned sequence, but both needs should remain visible in one coordinated plan.

### Do I have to be abstinent before receiving mental-health help?

Not as a universal rule. NICE says people with severe mental illness should not be excluded from mental-health services because of substance misuse. Intoxication may affect what can be assessed safely at a particular moment, but services should respond to urgent needs and arrange follow-up.

### Does dual diagnosis always require residential rehab?

No. Many people are supported through community addiction treatment, primary care and mental-health services. Residential or specialist inpatient care may be appropriate when risks, withdrawal, housing or complexity cannot be managed safely at home. Assessment should determine the setting.

### Can dual diagnosis be treated online?

Online recovery support may be useful for an assessed, medically stable person, particularly as part of continuing care. It is not a substitute for emergency treatment, medically managed withdrawal or in-person psychiatric care when these are required.

### Can family members be involved?

Yes, usually with the person's consent. Families can contribute information and support a crisis or recovery plan. Confidentiality may limit what services disclose, but relatives can still share concerns and receive general guidance. Safeguarding duties continue to apply.

### What should a coordinated care plan include?

It should identify the person's goals, current risks, interventions for both mental health and substance use, medication and withdrawal arrangements, the lead professional, responsibilities across services, information-sharing consent, crisis actions, practical needs and follow-up.`.trim(),
  },
{
  slug: "online-recovery-programmes",
  title: "Online Addiction Recovery Programme: Evidence & Safety",
  excerpt: "A clinically informed UK guide to how online addiction recovery works, who it may suit, its safety limits and how to choose credible support.",
  author: "Craig Bilton",
  authorRole: "Founder & Clinical Director",
  date: "2026-02-10",
  updatedDate: "2026-08-13",
  readingTime: 25,
  category: "Treatment Options",
  image: "/online-addiction-recovery-programme-uk-hero.webp",
  ogImage: "/online-addiction-recovery-programme-uk-hero-og.webp",
  imageAlt: "Adult taking part in a confidential online addiction recovery session at home.",
  seoTitle: "Online Addiction Recovery Programme: UK Guide | IRN",
  metaDescription: "Learn how online addiction recovery programmes work, who they may suit, safety limits, evidence and how to choose credible UK support.",
  ogTitle: "Online Addiction Recovery Programme: Evidence & Safety",
  ogDescription: "A clinically informed UK guide to online recovery evidence, suitability, safety, programme quality and when more intensive care is needed.",
  publishedStatus: "published",
  medicalWebPage: true,
  supportingImages: [
    {
      afterHeading: "What a suitability assessment should cover",
      src: "/online-recovery-suitability-assessment.webp",
      alt: "Confidential online assessment for addiction recovery programme suitability.",
      caption: "A suitability assessment should consider withdrawal risk, mental health, home safety, previous treatment and the support available around the person."
    },
    {
      afterHeading: "Getting the most from online recovery",
      src: "/online-recovery-relapse-prevention-plan.webp",
      alt: "Person building a weekly recovery and relapse-prevention plan at home.",
      caption: "Good online care continues between sessions through practical planning, reflection, support and regular review."
    }
  ],
  faq: [
    {
      question: "Do online addiction recovery programmes work?",
      answer: "They can help, but outcomes depend on the intervention, the person and how well the level of care fits. A 2025 review found promising results for remote interventions, especially as an addition to in-person care, while also finding substantial risk of bias in the evidence. No credible provider should guarantee an outcome or treat all online programmes as equivalent."
    },
    {
      question: "Can an online programme help me detox?",
      answer: "Not unless a separately regulated medical service has assessed and is medically managing the withdrawal. A recovery programme should not present video sessions, groups or an app as detoxification. Alcohol and benzodiazepine withdrawal can be dangerous. Obtain medical advice before stopping if physical dependence or withdrawal may be present."
    },
    {
      question: "Is online recovery suitable for severe addiction?",
      answer: "Severity is only one consideration. Withdrawal risk, overdose history, mental health, housing, safeguarding, previous treatment and ability to engage all matter. Some people with longstanding problems can use online continuing care safely; others need medical, intensive community or residential support. Assessment is more reliable than a label."
    },
    {
      question: "Is online recovery confidential?",
      answer: "It should be delivered with clear privacy and data-protection arrangements, but participants also need a private space and secure device where possible. Ask whether sessions are recorded, which platform is used, who can access notes and how information is shared. Group members should agree confidentiality, although a provider cannot guarantee another participant's behaviour absolutely."
    },
    {
      question: "Can online recovery be used after rehab?",
      answer: "Yes. It can provide continuing structure, relapse-prevention review and support while the person applies recovery skills at home. It should complement the discharge plan and maintain necessary links with local medical, mental-health and community services."
    },
    {
      question: "What happens if I relapse during an online programme?",
      answer: "Tell the programme promptly and assess immediate safety. The response may include medical help, a revised plan, more frequent contact or a move to a higher level of care. Relapse should prompt review rather than shame, but it must not be minimised when overdose, withdrawal or mental-health risk has increased."
    }
  ],
  sources: [
    {
      title: "Drug misuse in over 16s: psychosocial interventions",
      publisher: "NICE",
      url: "https://www.nice.org.uk/guidance/CG51/chapter/recommendations"
    },
    {
      title: "Alcohol-use disorders: diagnosis, assessment and management",
      publisher: "NICE",
      url: "https://www.nice.org.uk/guidance/cg115/chapter/Recommendations"
    },
    {
      title: "Coexisting severe mental illness and substance misuse",
      publisher: "NICE",
      url: "https://www.nice.org.uk/guidance/ng58/chapter/recommendations"
    },
    {
      title: "Drug misuse and dependence: UK guidelines on clinical management",
      publisher: "Department of Health and Social Care",
      url: "https://www.gov.uk/government/publications/drug-misuse-and-dependence-uk-guidelines-on-clinical-management"
    },
    {
      title: "Clinical guidelines for alcohol treatment: psychosocial interventions",
      publisher: "Department of Health and Social Care",
      url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/5-psychosocial-interventions"
    },
    {
      title: "How effective are remote and digital interventions as part of alcohol and drug treatment and recovery support?",
      publisher: "Addiction",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12215248/"
    },
    {
      title: "Telemedicine-delivered treatment interventions for substance use disorders",
      publisher: "Journal of Substance Abuse Treatment",
      url: "https://pubmed.ncbi.nlm.nih.gov/31006553/"
    },
    {
      title: "Alcohol-use disorder",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/alcohol-use-disorder/"
    },
    {
      title: "Urgent support",
      publisher: "NHS",
      url: "https://www.nhs.uk/every-mind-matters/urgent-support/"
    },
    {
      title: "Choosing an online healthcare service",
      publisher: "Care Quality Commission",
      url: "https://www.cqc.org.uk/care-services/help-choosing-care/choosing-online-healthcare-service"
    },
    {
      title: "Data sharing and recording online meetings",
      publisher: "Information Commissioner's Office",
      url: "https://ico.org.uk/for-organisations/advice-for-small-organisations/information-security/data-sharing-advice/"
    }
  ],
  content: `This guide is for adults concerned about their own addiction or compulsive behaviour, and for families supporting them. It is educational and does not diagnose addiction, provide medical detoxification, prescribe medication or replace emergency, GP or specialist care.

## The concise answer

**Concise answer:** An online addiction recovery programme can provide structured psychosocial support through live individual or group sessions, recovery education, practical assignments, progress reviews and relapse-prevention planning while a person remains at home. It may be suitable for an adult who is medically stable, has a safe and reasonably private environment and can engage consistently. It is not a substitute for medical detoxification, emergency mental health care or 24-hour residential support.

A 2025 systematic review found promising outcomes for remote interventions, particularly when they supplemented in-person treatment, but much of the evidence was at high risk of bias. The safest conclusion is that online care can be valuable when the programme is credible and the level of care matches the person's risks and needs.

> **Urgent safety information:** If you or someone else is in immediate danger, call 999 or go to A&E. In England, if urgent mental health help is needed but it is not an emergency, use NHS 111 online or call 111 and select the mental health option. Alcohol withdrawal can be dangerous: if you experience withdrawal symptoms, obtain medical help before trying to stop.

## Table of contents

1. [Key takeaways](#key-takeaways)
2. [What is an online addiction recovery programme?](#what-is-an-online-addiction-recovery-programme)
3. [What does the evidence say?](#what-does-the-evidence-say)
4. [Who may be suitable?](#who-may-be-suitable)
5. [When online support is not enough](#when-online-support-is-not-enough)
6. [What a suitability assessment should cover](#what-a-suitability-assessment-should-cover)
7. [What a good programme should include](#what-a-good-programme-should-include)
8. [Online programme, outpatient care or residential rehab?](#online-programme-outpatient-care-or-residential-rehab)
9. [How to assess a provider](#how-to-assess-a-provider)
10. [Getting the most from online recovery](#getting-the-most-from-online-recovery)
11. [Privacy, technology and accessibility](#privacy-technology-and-accessibility)
12. [Relapse, disengagement and stepping up care](#relapse-disengagement-and-stepping-up-care)
13. [Online recovery after residential treatment](#online-recovery-after-residential-treatment)
14. [Support for families](#support-for-families)
15. [When to seek professional help](#when-to-seek-professional-help)
16. [Frequently asked questions](#frequently-asked-questions)

## Key takeaways

- Online recovery is a **delivery format**, not a single treatment. Its quality depends on the assessment, practitioners, therapeutic methods, safeguarding, review process and links with other services.
- It may be appropriate where the person is medically stable, able to participate and living in an environment that supports rather than undermines recovery.
- It should not be used to manage dangerous withdrawal, acute psychosis, immediate suicide risk, serious physical illness or a situation requiring 24-hour containment.
- Recent evidence is encouraging but not definitive. Remote support appears particularly useful as an addition to other treatment; evidence for replacing in-person care completely is less certain.
- A credible programme should define its scope, assess suitability, use appropriately trained staff, monitor progress and have a clear process for escalating risk.
- The best next step is often an honest assessment of need rather than choosing a service by convenience, price or marketing claims alone.

## What is an online addiction recovery programme?

An online addiction recovery programme is a planned course of support delivered through secure video, telephone and digital tools. Unlike a general wellbeing app or occasional peer meeting, a structured programme should have a defined purpose, sequence and review process.

Depending on the provider and the person's needs, it may include:

- an initial assessment of substance use, mental health, physical health, safety and recovery goals
- regular one-to-one sessions
- facilitated recovery groups
- psychoeducation about dependence, cravings, triggers and behaviour change
- motivational work to strengthen readiness for change
- practical relapse-prevention planning
- recovery assignments between sessions
- monitoring of progress, risk and engagement
- family involvement, with consent and where clinically appropriate
- coordination with a GP, prescriber, local drug and alcohol service or mental health team when needed
- continuing care after detoxification or residential rehabilitation.

The word **online** describes where contact happens. It does not prove that a programme is clinical, evidence based or suitable. A video call can deliver skilled therapeutic work, but it can also deliver poorly structured advice. The important questions are what is being provided, by whom, for which needs, with what safety arrangements and how progress is reviewed.

Online mutual-aid meetings, self-guided courses, apps, coaching and formal therapy may all have a role, but they are not interchangeable. Someone comparing services should ask whether the offer is education, peer support, counselling, a regulated healthcare activity or a coordinated treatment pathway. Clear providers explain those boundaries rather than allowing people to assume that every need can be managed remotely.

## What does the evidence say?

The evidence is more promising than the outdated idea that remote support is automatically inferior to support delivered in a room. It is also more nuanced than claims that online treatment is universally equivalent to face-to-face care.

A 2025 systematic review and meta-analysis in *Addiction* examined 34 randomised controlled trials involving 6,461 adults with alcohol or drug use disorders. It found that remote interventions used **alongside** in-person treatment were associated with lower odds of relapse and fewer days of alcohol or drug use than in-person treatment alone. When remote interventions replaced or partly replaced in-person care, relapse outcomes also favoured remote support, but the change in days of use was small and uncertain. More than 70% of the outcomes were judged to be at high risk of bias, and results differed by substance and therapeutic approach.

That review supports three cautious conclusions:

1. Remote support can be an active part of treatment and recovery, not merely a convenient substitute for information leaflets.
2. It may be especially useful when it adds contact, skills practice or monitoring to an existing pathway.
3. The research does not justify assuming that every online programme is effective or that remote care can safely replace every form of in-person treatment.

Earlier systematic reviews reached a similar broad position: telemedicine and digital interventions can improve reach and are acceptable to many participants, but studies vary substantially in quality, design, population and outcome measurement. Results from a structured programme with live practitioner contact should not be transferred automatically to a self-guided app, and findings for alcohol should not be assumed to apply identically to opioids, benzodiazepines, stimulants, cannabis or behavioural addictions.

UK guidance focuses less on the screen through which care is delivered and more on the content and safety of care. NICE recommends risk assessment, appropriately trained staff, psychosocial interventions, progress monitoring, relapse-prevention support and coordinated care according to the person's needs. The UK clinical guidelines for drug misuse state that treatment should include a psychosocial component and emphasise therapeutic alliance, evidence-based interventions, structure, goal direction, supportive social networks and outcome monitoring. Those principles are possible online, but a service needs to design for them deliberately.

For alcohol treatment, current UK clinical guidance recognises online tools as possible additional support alongside structured treatment. It does not describe an app or virtual programme as a replacement for medically supported withdrawal when that is required.

The practical message is straightforward: online delivery can be credible, but effectiveness depends on **fit, programme quality, participation and connection with the wider care system**.

## Who may be suitable?

An online programme may be a reasonable option for an adult whose current risks can be managed safely at home and who can make practical use of remote support. Suitability is individual; no checklist can replace assessment.

Factors that often support online participation include:

### Medical stability

There is no current need for emergency assessment, inpatient stabilisation or medically supervised detoxification. The person is not relying on an online programme to manage withdrawal or prescribe medication.

### A safe and workable home environment

The person has somewhere they can attend sessions with reasonable privacy. The environment does not contain immediate violence, coercion, uncontrolled substance use or constant disruption that makes participation unsafe or unrealistic.

### Capacity to engage

The person can use the relevant technology, attend agreed sessions and complete at least some work between them. Motivation does not need to be perfect; ambivalence is common. There does, however, need to be enough willingness to communicate honestly and test new behaviour.

### Risks that can be monitored remotely

The person's mental and physical health needs do not require observation that a remote service cannot provide. Where other professionals are involved, communication and responsibility should be clear.

### A proportionate level of care

Online support may fit someone with harmful or dependent use whose risks are manageable in the community, a person seeking early intervention, or someone returning to daily life after more intensive treatment. It may also help people whose location, work, mobility or caring responsibilities make regular travel difficult.

Convenience alone does not establish suitability. A person may strongly prefer online care because it is discreet or easier to fit around work, yet still need medical or residential support. A good assessment respects preference while being honest about risk.

## When online support is not enough

Some situations need a different or higher level of care. Online support can sometimes remain part of a wider plan, but it should not be the only response when the person requires urgent, medical or round-the-clock intervention.

Seek an appropriate clinical assessment rather than relying on online recovery alone where there is:

- possible dangerous withdrawal, including alcohol or benzodiazepine dependence
- a history of withdrawal seizures, delirium or complicated detoxification
- current hallucinations, severe confusion, psychosis or mania
- immediate suicide risk, serious self-harm risk or risk to other people
- overdose, chest pain, breathing difficulty, collapse or another medical emergency
- severe intoxication that prevents meaningful participation
- an unsafe home, domestic abuse, exploitation or serious safeguarding concern
- repeated rapid relapse despite well-delivered community support
- uncontrolled polydrug use or high overdose risk
- homelessness or no private, reliable place from which to engage
- cognitive impairment or communication needs that the programme cannot accommodate
- a need for medication initiation or monitoring outside the programme's competence or regulatory scope.

Alcohol deserves particular caution. The NHS states that stopping suddenly can be dangerous for someone who is dependent and advises obtaining medical help before stopping if withdrawal symptoms occur. Symptoms may include tremor, sweating, nausea, anxiety, a racing heartbeat, hallucinations, confusion or seizures. A video recovery group is not a detox service.

Likewise, someone with coexisting severe mental illness and substance misuse should not be bounced between services. NICE recommends comprehensive assessment, coordinated care and attention to physical health, housing, social care and safeguarding as well as substance use. Online sessions may improve access, but they cannot make those wider needs disappear.

## What a suitability assessment should cover

A proper assessment is not a test someone passes or fails. Its purpose is to understand needs, identify risk and agree the safest proportionate pathway.

It should explore:

### Substance use and withdrawal

Which substances or behaviours are involved? How often, how much and by what route? Has use increased? Are there morning symptoms, withdrawal symptoms, blackouts, overdoses or previous medically complicated withdrawals? Are prescribed medicines, illicit drugs and alcohol being combined?

### Physical health

Relevant conditions, pregnancy, current medication, pain, sleep, nutrition and recent medical symptoms matter. A recovery practitioner should know when medical input is required rather than trying to work beyond their role.

### Mental health and immediate safety

Assessment should include mood, anxiety, trauma symptoms, psychosis, self-harm, suicidal thinking, risk to others and current contact with mental health services. An online programme needs a plan for what happens if risk increases during or between sessions.

### Treatment and recovery history

What has been tried before? What helped, even briefly? What led to disengagement or relapse? Previous attempts are useful clinical information, not evidence that a person is incapable of recovery.

### Home and social environment

Who lives with the person? Is anyone else using substances? Is there privacy, internet access and a safe place for sessions? Are there caring duties, work pressures, housing problems or relationship risks that affect engagement?

### Goals, preferences and readiness

Some people want abstinence; others first want to reduce harm, understand their pattern or prepare for more intensive treatment. Goals should be discussed openly and reviewed. A credible provider should not promise a pathway it cannot safely deliver simply to secure enrolment.

### Other services and escalation

The assessment should identify whether the person needs a GP, local authority drug and alcohol service, prescriber, mental health team, medical detoxification or residential placement. It should be clear who holds responsibility for each part of care.

**Practical next step:** If you are unsure which level of help fits, use a confidential [recovery assessment](/assessments) to organise the relevant information. If withdrawal or immediate safety may be an issue, seek medical advice rather than waiting for an online programme appointment.

## What a good programme should include

There is no single formula, but credible structured programmes tend to share the following features.

### A defined scope

The service explains what it does and does not provide. It distinguishes recovery support from medical detoxification, diagnosis, prescribing and emergency care. Age limits, location limits and exclusions should be visible.

### Individual assessment and a care plan

People should not be placed automatically into the same timetable. The plan should reflect their goals, risks, mental health, social environment, strengths and other services involved.

### Appropriately trained and supervised practitioners

Qualifications should be described accurately. Terms such as clinician, therapist, counsellor, coach and recovery practitioner are not synonyms. If a regulated healthcare professional is providing treatment in their registered capacity, the provider should comply with the relevant professional and regulatory requirements.

### Evidence-informed psychosocial work

Content may include motivational approaches, cognitive and behavioural strategies, coping-skills training, relapse prevention, social-network work and support for coexisting anxiety or depression where the practitioner is competent to provide it. The method should match the need rather than being selected because it is easy to put into videos.

### Human contact and therapeutic alliance

Digital worksheets can reinforce learning, but they should not be presented as a replacement for human judgement when a person needs assessment, formulation or support. The relationship with a consistent practitioner or team can help create trust, accountability and honest review.

### Work between sessions

Recovery develops in ordinary life. Useful between-session work may involve tracking triggers, planning for high-risk situations, practising emotion-regulation skills, rebuilding routine, attending mutual aid, repairing sleep or preparing a conversation with family.

### Progress and risk review

The service should agree meaningful measures. These may include substance-use days, recovery goals, attendance, cravings, wellbeing, sleep, social connection or use of coping strategies. Monitoring should prompt discussion and adaptation, not become surveillance or a simplistic score of whether someone is doing recovery correctly.

### A response to non-attendance and deterioration

NICE guidance highlights the importance of maintaining contact with people at risk of losing touch with services. A provider should explain what happens after missed sessions, a return to use, disclosure of suicidal thinking or signs that the current care level is no longer safe.

### Continuing-care and referral links

Online care works best as part of a pathway. A programme should be able to coordinate appropriately with medical, mental health, residential, family and local services instead of treating referral as failure.

## Online programme, outpatient care or residential rehab?

These options overlap, and the terms are used differently by providers. The comparison below is a starting point, not a recommendation for a particular person.

| Feature | Structured online programme | In-person outpatient/community care | Residential rehab |
|---|---|---|---|
| Where support happens | At home by video, telephone and digital tools | Clinic or community setting while living at home | Person lives at the treatment setting |
| Typical strength | Access, flexibility and applying recovery skills in real life | Direct local contact and easier physical assessment or coordinated community care | Separation from immediate triggers, high structure and 24-hour environment |
| Main limitation | No physical containment; remote observation is limited | Travel, waiting times or variable local access | Cost, time away and major transition back home |
| Detoxification | Not provided by a recovery programme unless separately delivered by an appropriately regulated medical service | May be arranged or medically managed in the community for suitable people | May be available on site or linked to inpatient care; must be medically assessed |
| Suitable mental-health complexity | Only where needs and risks can be managed safely and coordinated | Can link directly with local mental-health services | May suit some complex cases, depending on clinical capability and psychiatric support |
| Best use | Early intervention, structured community recovery or continuing care | Community treatment requiring local professional input | Higher-intensity support when containment or separation is needed |

A staged pathway is often more realistic than a permanent choice between formats. Someone may need medical detoxification, then residential or community treatment, followed by online continuing care. Another person may begin online, then step up if repeated use, risk or home instability shows that more support is needed.

For a fuller comparison, read [Online Addiction Support vs Residential Rehab](/resources/online-addiction-support-vs-residential-rehab). If the likely need is more intensive, [treatment placement](/treatment-placement) can help organise an assessment-led search rather than choosing a centre from advertising alone.

## How to assess a provider

Use questions that make the provider explain its clinical and operational model.

1. **Who is the programme designed for, and who is it not suitable for?**
2. **What assessment occurs before enrolment?**
3. **Does the programme provide treatment, counselling, coaching, peer support or education?**
4. **Who delivers sessions, and what are their qualifications, professional registrations and supervision arrangements?**
5. **How are withdrawal risk, suicide risk, psychosis and safeguarding concerns handled?**
6. **What happens if I relapse, miss sessions or become more unwell?**
7. **How is progress reviewed, and can the plan change?**
8. **How do you coordinate with my GP, prescriber or mental health team?**
9. **Are groups recorded? How is sensitive information protected?**
10. **What outcome evidence do you publish, and are denominators, follow-up periods and dropout rates included?**
11. **What is the full cost, cancellation policy and minimum commitment?**
12. **What aftercare or step-down support is available?**

Be cautious if a provider guarantees recovery, claims one format works for everyone, cannot identify who holds clinical responsibility, minimises withdrawal risk or uses impressive outcome percentages without explaining who was measured and for how long.

Regulation also requires nuance. In England, the Care Quality Commission regulates providers when they carry on specified regulated activities. Not every recovery-support or coaching service falls within the same regulatory scope. If a service provides online medical consultations, diagnosis, prescribing or treatment by listed healthcare professionals, ask which activities are regulated and verify any registration claimed. CQC provides public guidance on choosing online healthcare services.

## Getting the most from online recovery

An appropriate programme still depends on active participation. The following steps make engagement more practical.

### Protect the time and space

Use headphones, close unnecessary apps and choose the most private place available. Tell household members when you cannot be interrupted. If privacy cannot be created safely, discuss alternatives with the provider rather than withholding important information.

### Treat sessions as appointments, not content

Join on time, keep the camera arrangement agreed with the practitioner and avoid attending while driving, working or caring for someone else. Online convenience should not turn a therapeutic session into background activity.

### Be honest about use and setbacks

A return to use changes risk and planning. Hiding it may keep someone in a level of care that is no longer safe. Good services respond with assessment and adaptation, not humiliation.

### Do the work in daily life

Use the period between sessions to test the plan: change access to substances, build routine, practise coping skills, contact supportive people and review warning signs. Digital tools can provide prompts and records, but they do not carry out those actions for you.

### Agree how family is involved

Family participation should have a purpose and respect consent, confidentiality and safety. It may help with practical support, boundaries and early warning signs. It should not turn a partner or parent into a monitor responsible for the person's recovery.

### Review fit, not just attendance

Attending every session is not sufficient if risk is increasing or nothing changes. Ask periodically: Is the plan addressing the main drivers? Is use reducing or becoming safer? Is mental health improving or deteriorating? Is more intensive care needed?

## Privacy, technology and accessibility

Addiction and mental-health information is sensitive. Before starting, read the provider's privacy notice and ask:

- which platform is used and how access is controlled
- whether sessions or groups are recorded
- what notes are kept and who can see them
- how information is shared with other professionals or family
- what happens if the connection fails during a risk disclosure
- whether participants can use a preferred name on group software
- how data-subject rights and complaints are handled.

The Information Commissioner's Office advises organisations that recording online meetings requires a valid purpose and lawful basis, and that participants should be told why a recording is made, how it will be used and how long it will be kept. In recovery groups, the safest default is usually not to record unless there is a clear, justified and transparent reason.

Technology can also exclude. Hearing, sight, literacy, language, neurodiversity, cognitive needs, limited data and low digital confidence may affect participation. A credible service should discuss reasonable adjustments and alternative contact methods. Online care is only more accessible if the person can actually use it.

## Relapse, disengagement and stepping up care

A lapse or relapse is clinically important information, not proof that treatment has failed. The response should be proportionate to what happened and the current risks.

A programme should help the person:

1. establish immediate safety
2. identify what was used, how much and whether urgent medical help is needed
3. consider overdose, withdrawal, self-harm and safeguarding risk
4. contact the relevant professional or emergency service when required
5. understand the sequence of warning signs and triggers without shame
6. revise the recovery and crisis plans
7. decide whether the current level of care remains sufficient.

Repeated relapse, escalating quantity, dangerous combinations, loss of housing, worsening mental health or inability to attend may all indicate that online-only support is no longer proportionate. Stepping up to local specialist treatment, medical care or residential support is a clinical adjustment, not a punishment.

Equally, a missed session should not automatically lead to discharge. NICE guidance for people with severe mental illness and substance misuse treats loss of contact as a concern and recommends proactive, flexible efforts to reconnect. Online programmes should have an agreed contact policy that respects both safety and privacy.

## Online recovery after residential treatment

The return home after residential treatment is a major change in environment and responsibility. Triggers, relationships, work pressures and unstructured time reappear. Online continuing care can create a bridge between the treatment plan and the person's real daily life.

Useful aftercare may include:

- reviewing the discharge and relapse-prevention plans
- regular one-to-one and group contact
- monitoring early warning signs
- coordinating with local services and prescribers
- practising responses to real situations as they arise
- involving family appropriately
- rebuilding work, sleep, exercise and social routines
- agreeing rapid support if risk rises.

Continuity matters more than ownership. The online provider should not replace parts of the discharge plan that require medical, psychiatric or local follow-up. With consent, information should pass between services clearly enough that the person does not have to repeatedly retell their history or manage conflicting advice alone.

## Support for families

Families often value online access because meetings can be easier to arrange around work, geography and caring responsibilities. Family involvement may provide education, help people agree boundaries and create a shared response to warning signs.

It should also protect the family member's own wellbeing. A partner or parent cannot provide medical monitoring, guarantee abstinence or be available around the clock. Their role needs limits.

Helpful questions for families include:

- What signs would mean we contact the programme, a clinician or emergency services?
- What information can be shared with us, with the person's consent?
- Which behaviours will we support, and which consequences will we stop absorbing?
- How will we respond to intoxication or aggressive behaviour safely?
- What support is available for us separately?

NICE recommends information, guided self-help and access to support for families and carers affected by drug misuse, with family meetings considered where needs continue. Family support is not an optional marketing extra; it can be an important separate strand of care.

## How Insight Recovery Network approaches online support

Insight Recovery Network's [online recovery programme](/online-programme) combines structured individual and group contact, recovery tasks, relapse-prevention work and access to [Insight OS](/insight-os) for reflection, check-ins and planning between sessions. Suitability is considered before a programme recommendation. IRN does not provide medical detoxification, diagnosis, prescribing or emergency care, and may recommend medical assessment or a higher level of support where online care is not sufficient.

This service description is not proof of effectiveness. To strengthen transparency over time, IRN should publish clearly defined first-party measures such as enquiries assessed, acceptance criteria, enrolment, attendance, completion, attrition, follow-up windows and the precise outcome measures used. Results should include denominators and limitations and should never imply that self-reported programme data are equivalent to an independent clinical trial.

## When to seek professional help

Arrange a professional assessment if substance use is difficult to control, is affecting health, work or relationships, repeatedly returns after attempts to stop, or is being used to cope with anxiety, depression, trauma or another mental-health difficulty.

Seek medical advice before reducing or stopping alcohol if there are withdrawal symptoms such as shaking, sweating, nausea, anxiety or needing a drink to feel normal. Do not use this article or an online recovery programme as detox instructions. Similar caution is needed with benzodiazepines and other medicines that can cause withdrawal; speak to the prescriber or an appropriate medical service and read the [benzodiazepine dependence safety guide](/resources/benzodiazepine-addiction).

Use urgent or emergency help if there is severe withdrawal, a seizure, hallucinations, confusion, overdose, breathing difficulty, chest pain, collapse, serious self-harm risk or danger to another person. Call 999 or go to A&E for an emergency. In England, NHS 111 can direct urgent physical or mental-health care when it is not an emergency.

If the person is safe but the level of care is unclear, a confidential assessment can compare online, community, medical and residential options. The aim is not to persuade someone into the most intensive service; it is to avoid asking a lower-intensity service to manage risks it cannot safely hold.

## Frequently asked questions

### Do online addiction recovery programmes work?

They can help, but outcomes depend on the intervention, the person and how well the level of care fits. A 2025 review found promising results for remote interventions, especially as an addition to in-person care, while also finding substantial risk of bias in the evidence. No credible provider should guarantee an outcome or treat all online programmes as equivalent.

### Can an online programme help me detox?

Not unless a separately regulated medical service has assessed and is medically managing the withdrawal. A recovery programme should not present video sessions, groups or an app as detoxification. Alcohol and benzodiazepine withdrawal can be dangerous. Obtain medical advice before stopping if physical dependence or withdrawal may be present.

### Is online recovery suitable for severe addiction?

Severity is only one consideration. Withdrawal risk, overdose history, mental health, housing, safeguarding, previous treatment and ability to engage all matter. Some people with longstanding problems can use online continuing care safely; others need medical, intensive community or residential support. Assessment is more reliable than a label.

### Is online recovery confidential?

It should be delivered with clear privacy and data-protection arrangements, but participants also need a private space and secure device where possible. Ask whether sessions are recorded, which platform is used, who can access notes and how information is shared. Group members should agree confidentiality, although a provider cannot guarantee another participant's behaviour absolutely.

### Can online recovery be used after rehab?

Yes. It can provide continuing structure, relapse-prevention review and support while the person applies recovery skills at home. It should complement the discharge plan and maintain necessary links with local medical, mental-health and community services.

### What happens if I relapse during an online programme?

Tell the programme promptly and assess immediate safety. The response may include medical help, a revised plan, more frequent contact or a move to a higher level of care. Relapse should prompt review rather than shame, but it must not be minimised when overdose, withdrawal or mental-health risk has increased.`.trim()
},
  {
    slug: "addiction-support-for-families",
    title: "Addiction Support for Families: A Complete UK Guide",
    excerpt: "Practical UK guidance for families affected by addiction: safety, conversations, boundaries, treatment options and support for your own wellbeing.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-08-14",
    readingTime: 25,
    category: "Family Support",
    image: "/addiction-support-for-families-uk-hero.webp",
    ogImage: "/addiction-support-for-families-uk-hero-og.webp",
    imageAlt: "Two adult relatives speaking with a family addiction support practitioner.",
    seoTitle: "Addiction Support for Families: UK Guide | IRN",
    metaDescription: "Practical UK guidance for families affected by addiction: safety, conversations, boundaries, treatment options and support for your own wellbeing.",
    ogTitle: "Addiction Support for Families: A Complete UK Guide",
    ogDescription: "Evidence-based guidance for families on safety, communication, boundaries, treatment decisions and support in their own right.",
    publishedStatus: "published",
    medicalWebPage: true,
    supportingImages: [
      {
        afterHeading: "Start with safety, not persuasion",
        src: "/family-addiction-safety-boundaries-plan.webp",
        alt: "Family creating a safety and boundaries plan with an addiction support practitioner.",
        caption: "A useful family plan separates urgent safety actions from longer-term boundaries and makes each person's responsibilities clear.",
      },
      {
        afterHeading: "Support for your own wellbeing",
        src: "/support-for-family-affected-by-addiction.webp",
        alt: "Family member receiving confidential support for the impact of a loved one's addiction.",
        caption: "Family members can receive confidential information, peer support and help for their own health even when their loved one is not in treatment.",
      },
    ],
    faq: [
      {
        question: "What support is available for families affected by addiction in the UK?",
        answer: "Options include a GP, local NHS or council-commissioned alcohol and drug services, family appointments, peer groups, counselling, carers' services, safeguarding support and private family guidance. The NHS lists organisations including FRANK, Adfam, Addiction Family Support, Families Anonymous and SMART Family & Friends. The right option depends on whether the immediate need is safety, information, emotional support, treatment planning or help for children or vulnerable adults.",
      },
      {
        question: "Can I get family support if my loved one refuses treatment?",
        answer: "Yes. UK guidance says affected relatives should be offered information and support even when the person with the alcohol problem is not attending treatment. A service can usually discuss your own wellbeing, general risk information, coping, boundaries and available services without disclosing the other person's confidential clinical information.",
      },
      {
        question: "How can I help someone with addiction without enabling them?",
        answer: "Support safety and access to care while avoiding actions that repeatedly hide harm or transfer responsibilities the person could reasonably hold. You might arrange an assessment or call an ambulance, but decline to give cash, provide false explanations or allow impaired driving. Context matters: harm reduction and emergency help are not enabling. A family professional can help make boundaries safe and realistic.",
      },
      {
        question: "What boundaries should families set around addiction?",
        answer: "A useful boundary is specific, proportionate and within your control. It might cover money, driving, substances in the home, abusive communication or what help you will offer. State what you will do rather than using a threat to force recovery. Boundaries involving housing, children, domestic abuse, disability or financial dependence may need legal, safeguarding or specialist advice.",
      },
      {
        question: "Can a family force an adult into rehab in the UK?",
        answer: "A family cannot ordinarily compel a capacitous adult into addiction treatment solely because relatives believe rehab is needed. Emergency, safeguarding, mental-capacity and mental-health procedures may apply in particular high-risk circumstances, but professionals must assess those. Families can prepare options, stop participating in unsafe patterns and act when emergency or safeguarding thresholds are met.",
      },
      {
        question: "What should I do in an addiction-related emergency?",
        answer: "Call 999 if someone is unconscious, cannot be woken, has a seizure, is struggling to breathe, may have overdosed, or presents an immediate danger to themselves or others. Tell responders what substances or medicines may be involved. Use naloxone for a suspected opioid overdose if it is available and you know how, but still call 999. Do not attempt to manage dangerous withdrawal or violence alone.",
      },
    ],
    sources: [
      { title: "Drug misuse in over 16s: psychosocial interventions", publisher: "NICE", url: "https://www.nice.org.uk/guidance/CG51/chapter/recommendations" },
      { title: "Clinical guidelines for alcohol treatment: principles of care", publisher: "Department of Health and Social Care", url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/2-principles-of-care" },
      { title: "Clinical guidelines for alcohol treatment: assessment and treatment and recovery planning", publisher: "Department of Health and Social Care", url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/4-assessment-and-treatment-and-recovery-planning" },
      { title: "Clinical guidelines for alcohol treatment: psychosocial interventions", publisher: "Department of Health and Social Care", url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/5-psychosocial-interventions" },
      { title: "Clinical guidelines for alcohol treatment: parents in alcohol treatment services", publisher: "Department of Health and Social Care", url: "https://www.gov.uk/guidance/clinical-guidelines-for-alcohol-treatment/26-parents-in-alcohol-treatment-services" },
      { title: "Supporting adult carers", publisher: "NICE", url: "https://www.nice.org.uk/guidance/ng150/chapter/Recommendations" },
      { title: "Advice for families of people who use drugs", publisher: "NHS", url: "https://www.nhs.uk/live-well/addiction-support/advice-for-the-families-of-drug-users/" },
      { title: "Urgent mental-health support", publisher: "NHS", url: "https://www.nhs.uk/every-mind-matters/urgent-support/" },
      { title: "Safeguarding children affected by parental alcohol and drug use", publisher: "GOV.UK", url: "https://www.gov.uk/government/publications/safeguarding-children-affected-by-parental-alcohol-and-drug-use" },
      { title: "Domestic abuse: how to get help", publisher: "GOV.UK", url: "https://www.gov.uk/guidance/domestic-abuse-how-to-get-help" },
      { title: "Supplying take-home naloxone without a prescription", publisher: "GOV.UK", url: "https://www.gov.uk/guidance/supplying-take-home-naloxone-without-a-prescription" },
      { title: "Psychosocial interventions for family members affected by another's substance use", publisher: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/36744608/" },
      { title: "Advice for parents and carers", publisher: "FRANK", url: "https://www.talktofrank.com/get-help/concerned-about-a-child" },
      { title: "Consent to treatment and an adult's right to refuse", publisher: "NHS", url: "https://www.nhs.uk/tests-and-treatments/consent-to-treatment/" },
    ],
    content: `This guide is for adult partners, parents, adult children, siblings, friends and carers affected by another person's addiction. It offers general education and family guidance. It does not diagnose addiction, provide legal advice, direct an individual detoxification or replace emergency, safeguarding, GP or specialist care. Advice involving children requires age-appropriate and local safeguarding support.

## The concise answer

**Concise answer:** Addiction support for families should do two things: help relatives respond more safely and effectively to the person with the addiction, and protect the family's own physical, emotional and practical wellbeing. Useful support may include clear information, an independent family appointment, peer support, help with communication and boundaries, safeguarding advice, and a planned route into assessment or treatment if the person accepts help.

Families can influence conditions around recovery, but they cannot control another adult's decisions or take over clinical responsibility. Support remains worthwhile even when the person is not in treatment.

**Urgent safety information:** If someone is unconscious, having a seizure, severely confused, struggling to breathe, at immediate risk of suicide or violence, or otherwise in danger, call 999 or go to A&E. In England, urgent mental-health help that is not an emergency is available through NHS 111 online or by calling 111 and selecting the mental-health option. If domestic abuse is present, prioritise a safe contact with a specialist service; do not use a family confrontation when it could increase danger.

## Table of contents

1. [Key takeaways](#key-takeaways)
2. [What does addiction support for families include?](#what-does-addiction-support-for-families-include)
3. [Why family support matters](#why-family-support-matters)
4. [Start with safety, not persuasion](#start-with-safety-not-persuasion)
5. [How to talk about addiction](#how-to-talk-about-addiction)
6. [Boundaries, consequences and enabling](#boundaries-consequences-and-enabling)
7. [When the person refuses treatment](#when-the-person-refuses-treatment)
8. [Consent and confidentiality](#consent-and-confidentiality)
9. [Children, vulnerable adults and safeguarding](#children-vulnerable-adults-and-safeguarding)
10. [How families can support treatment and recovery](#how-families-can-support-treatment-and-recovery)
11. [Support for your own wellbeing](#support-for-your-own-wellbeing)
12. [Choosing family support in the UK](#choosing-family-support-in-the-uk)
13. [A practical seven-day family plan](#a-practical-seven-day-family-plan)
14. [How Insight Recovery Network supports families](#how-insight-recovery-network-supports-families)
15. [When to seek professional help](#when-to-seek-professional-help)
16. [Frequently asked questions](#frequently-asked-questions)

## Key takeaways

- Families deserve support in their own right; their needs do not depend on whether the person with the addiction enters treatment.
- Begin by separating immediate medical, mental-health and safeguarding risks from the longer-term work of communication, boundaries and treatment planning.
- A useful boundary states what **you** will do to protect safety or wellbeing. It is not a punishment designed to force recovery.
- Choose a calm, sober and reasonably safe time for a conversation. Describe specific observations, listen, avoid labels and offer one realistic next step.
- A family cannot ordinarily compel a capacitous adult into addiction treatment. It can stop participating in unsafe patterns, prepare options and act when risk requires professional intervention.
- Treatment services must respect confidentiality, but they can usually listen to relatives, explain general processes and offer the family support without disclosing the person's private information.
- Children and vulnerable adults should never be given responsibility for monitoring, rescuing or keeping an adult safe.
- Evidence supports family-focused and family-member interventions, but no method guarantees treatment entry, abstinence or a particular outcome.

## What does addiction support for families include?

The phrase **family support** can describe several different forms of help. They overlap, but they should not be treated as interchangeable.

**Support for the family member** focuses on the effect the situation is having on you. It may include a confidential appointment, guided self-help, a peer group, counselling, practical advice or help with your own mental and physical health.

**Family guidance** helps relatives understand addiction, identify risk, plan conversations, agree boundaries and decide how they will respond to recurring situations. It should increase clarity rather than make the family responsible for delivering treatment.

**Family involvement in treatment** happens when the person receiving care consents and involvement is appropriate. A relative might contribute history, attend selected sessions, support a recovery plan or understand what to do if risk increases. The purpose and limits of involvement should be agreed explicitly.

**Family-focused treatment** is a structured clinical intervention delivered by trained practitioners. Depending on the problem and service, this can include behavioural couples work, social network approaches or interventions designed specifically for affected family members.

**Intervention planning** is a carefully prepared process for raising concerns and offering treatment options. It is not the dramatic ambush often shown in television programmes. Where domestic abuse, violence, coercion, acute mental illness or other serious risk is present, a joint confrontation may be unsafe and specialist advice should come first.

**Treatment assessment and placement** addresses the person's clinical needs: substance use, withdrawal, overdose history, physical and mental health, safeguarding, previous treatment, home environment and willingness to engage. It may identify community, online, medically supported or residential options. Family preferences matter, but clinical fit and safety should lead the decision.

A better starting point than “How do we make them stop?” is: “What is urgent, what belongs to us, and what support does each person need?”

## Why family support matters

Addiction can reorganise family life around uncertainty. Relatives may monitor mood and intoxication, check whether someone is breathing, cover absences, lend money, care for children, manage appointments or wait for the next crisis. These responses often begin as attempts to protect someone. Over time, they can affect sleep, work, finances, relationships and health.

The clinical case for family support is not based only on the hope that a relative will persuade someone into treatment. UK guidance says family members should be offered information and support even when the person with the alcohol problem is not attending treatment. NICE guidance for drug misuse recommends guided self-help and support-group contact when family or carer needs are identified, with structured individual family meetings considered when significant problems continue.

The research is encouraging but should be described carefully. A 2023 systematic review included 19 studies of psychosocial interventions for family members affected by another person's substance use; 10 contributed to meta-analyses. Individual and group approaches showed favourable changes in outcomes such as depression, distress, coping and family functioning. The authors also warned that small samples and weak study methods limited the certainty of conclusions. Family support is evidence-informed, but it is not a guaranteed route to changing another person's behaviour.

Current UK alcohol-treatment guidance describes three legitimate aims of family-focused work:

1. helping a family member support treatment entry or engagement
2. involving family or social-network members in treatment, with consent
3. supporting affected relatives in their own right, whether or not the person drinking participates.

That third aim is easily overlooked. Your health, safety and stability are worthwhile outcomes. They are not consolation prizes for failing to make someone recover.

## Start with safety, not persuasion

When a family is frightened, the instinct is often to find the perfect argument. Risk assessment is more urgent than persuasion.

### Immediate danger

Call 999 if someone may have overdosed, is unconscious, cannot be woken, has severe breathing difficulty, is having a seizure, has collapsed, is severely confused, or there is immediate danger from suicide or violence. Tell the call handler what you know about alcohol, drugs or medicines taken. Stay within the instructions you are given and do not put yourself at risk.

Naloxone can temporarily reverse an opioid overdose. UK rules allow relevant services to supply take-home naloxone to people at risk and to family members or friends. If opioids may be involved, ask a local drug service or pharmacist whether naloxone and training are available. Using naloxone does not replace calling 999 because its effect can wear off and further treatment may be needed.

### Withdrawal risk

Do not direct someone to stop alcohol or benzodiazepines abruptly when dependence or withdrawal may be present. Severe withdrawal can be dangerous. A family member should not be expected to design a taper, lend prescribed medication or provide an informal home detox. Arrange medical assessment through a GP, NHS or specialist alcohol and drug service, or an appropriate detox provider. The [UK addiction detox guide](/resources/addiction-detox-uk) explains why setting and medical oversight matter.

### Mental-health crisis

Substance use may coexist with suicidal thoughts, psychosis, severe depression, agitation or confusion. If danger is immediate, call 999 or go to A&E. In England, NHS 111 can provide urgent mental-health help where the situation is urgent but not an emergency. Do not assume that every frightening behaviour is “just the addiction”. Physical illness, head injury, overdose, withdrawal and acute mental illness all require appropriate assessment.

### Violence and domestic abuse

Substance use does not cause or excuse domestic abuse. If you are afraid of a partner or family member, make safety the priority and seek confidential domestic-abuse advice. A boundary conversation or planned intervention may increase danger when coercive control or violence is present. If you are in immediate danger, call 999. If you cannot speak and need police help from a mobile, follow the operator's prompts and press 55 when prompted.

## How to talk about addiction

A conversation cannot guarantee insight or treatment, but it can make honesty and help more possible.

### Choose the conditions

Speak when the person is as sober and medically stable as possible, when neither of you is rushing and where you can leave safely. Do not begin a high-stakes conversation while someone is intoxicated, withdrawing, driving, caring for children or already escalating.

If you are afraid of their reaction, obtain professional advice before speaking. Safety matters more than having the conversation quickly.

### Use observations, not a prosecution case

Start with two or three specific changes you have seen:

- “You missed work twice this week after drinking.”
- “You said you would stop, but you have used again and seem frightened by it.”
- “I found you difficult to wake and I am worried about your safety.”

Avoid trying to prove every past incident. Labels such as “addict”, “selfish” or “in denial” can turn the discussion into a fight about identity. Describe behaviour, impact and concern.

### Say what you feel and need

Use clear first-person language: “I am worried”; “I will not travel with you when you have been drinking”; “I need the children to stay elsewhere tonight”; “I am willing to help arrange an assessment.” This is more useful than speaking for the entire family or predicting catastrophe to frighten the person.

### Ask and listen

Open questions can reveal readiness and barriers:

- “What worries you most about what has been happening?”
- “What have you tried already?”
- “What would make getting help feel possible?”
- “Would you agree to one confidential assessment before deciding anything else?”

Listening does not mean agreeing with minimisation or accepting abuse. It helps you understand whether the obstacle is fear of withdrawal, cost, stigma, work, childcare, a previous treatment experience or no current wish to change.

### Offer one proportionate next step

A list of ten services can overwhelm someone. Offer one action that matches the situation: a GP appointment, local drug and alcohol assessment, medically informed detox assessment, recovery assessment, family consultation or conversation with a treatment provider. If the person declines, state how you will respond and when you will revisit the subject.

For a fuller conversation framework, use [how to talk to someone about drinking or drug use](/resources/how-to-talk-to-someone-about-drinking-drug-use).

## Boundaries, consequences and enabling

Families are often told to “set boundaries” or “stop enabling” without being shown what those words mean. Poorly used, both can create shame and unsafe ultimatums.

### What a boundary is

A boundary is a clear statement about your own participation, property, money, contact or safety. It should be:

- linked to a real need or risk
- specific enough to understand
- within your control
- proportionate and lawful
- realistic to maintain
- reviewed if circumstances change.

Examples might include:

- “I will not give cash, but I can pay a necessary bill directly if I decide it is safe.”
- “You cannot drive my car or transport the children after drinking or using drugs.”
- “I will end the conversation if I am threatened and seek help if I feel unsafe.”
- “You cannot stay in my home while bringing drugs into it.”
- “I will help arrange treatment, but I will not call your employer with a false explanation.”

The appropriate boundary depends on housing rights, financial dependence, children, disability, risk and the relationship. Legal, safeguarding or domestic-abuse advice may be needed before changing access to a home, money or care.

### What a boundary is not

A boundary is not a threat whose only purpose is to force treatment. It is not a punishment, public humiliation or removal of essential help in a medical crisis. If you say you will do something you cannot safely or realistically do, the result may be more confusion rather than consistency.

### Rethinking “enabling”

The term is often used for actions that protect a person from the consequences of substance use: repeatedly replacing money, giving false explanations, paying drug debts or taking over responsibilities indefinitely. Some rescuing actions can unintentionally help an unsafe pattern continue.

Context matters. Providing food, calling an ambulance, protecting a child, supplying naloxone, arranging transport to treatment or reducing immediate harm is not the same as pretending nothing is wrong. Ask three questions:

1. Does this action improve immediate safety?
2. Does it transfer a responsibility that the person could reasonably hold?
3. Does it protect recovery and family wellbeing, or keep the same cycle going?

The guide to [helping someone without enabling](/resources/help-someone-with-addiction-without-enabling) and the guide to [family boundaries in recovery](/resources/family-boundaries-addiction-recovery) develop this distinction.

## When the person refuses treatment

A capable adult can make decisions that family members strongly disagree with. In ordinary circumstances, relatives cannot force an adult into addiction treatment simply because the situation is harmful. Mental-capacity, mental-health and safeguarding law can become relevant in specific circumstances, but those are professional assessments, not tools for a family to apply by itself.

Refusal does not mean the family must do nothing. You can:

- seek support and assessment for your own needs
- document specific risks and incidents accurately
- stop making false explanations or providing unsafe financial support
- agree a consistent response across the family where safe
- prepare realistic treatment options so they are available when willingness changes
- keep communication open without repeating the same argument every day
- contact professionals when medical, mental-health or safeguarding thresholds are reached.

Motivation can change. A calm response today may support a different decision later, but no family method guarantees treatment entry. Be cautious of providers promising that a particular script or confrontation will “break denial” or produce admission.

Read [what to do when someone refuses treatment](/resources/what-to-do-when-someone-refuses-treatment) for a more detailed decision guide.

## Consent and confidentiality

Confidentiality can feel one-sided to families. You may hold vital information but be told that a service cannot discuss the person's care. The distinction below helps.

If a capable adult does not consent, a service will usually be unable to disclose their personal clinical information to relatives. That does not necessarily prevent the service from:

- listening to information you provide
- recording a relevant concern according to its policy
- explaining general treatment processes
- giving general risk and emergency information
- signposting you to family support
- offering you a separate appointment about your own wellbeing.

The service may not be able to confirm whether the person is a patient or tell you what action it has taken. Ask how information from relatives is handled and whether you should put important concerns in writing.

When the person does consent to family involvement, agree the scope rather than assuming “full access”. Useful questions include:

- Which relatives may be contacted?
- What information can be shared, and what remains private?
- May the family attend assessments or reviews?
- What should happen after missed contact, relapse or rising risk?
- Who holds responsibility for urgent decisions?

Current UK alcohol guidance recommends clear confidentiality arrangements for both the person in treatment and the family member. It also supports separate appointments so relatives can disclose the impact on their own wellbeing in confidence.

Confidentiality is not absolute where law, immediate danger or safeguarding duties require information to be shared. A provider should explain its limits clearly rather than making vague promises.

## Children, vulnerable adults and safeguarding

Children can be affected by unpredictability, absence, conflict, unsafe driving, financial instability, caring responsibilities or frightening incidents even when they do not understand addiction. They should not be asked to monitor intoxication, hide substances, keep secrets, supervise withdrawal or become the emotional support for adults.

Practical protections may include identifying a safe adult, keeping emergency numbers accessible, arranging reliable school and childcare routines, preventing travel with an impaired driver and making sure essential needs are met. A child who is frightened or taking on substantial caring responsibilities may need help from school, a GP, a young-carers service, children's social care or a specialist organisation.

UK clinical guidance makes clear that adult treatment services have safeguarding responsibilities and should help parents and children access support and, when necessary, protection. Seeking help does not automatically determine one outcome for a family. The purpose of early help and safeguarding assessment is to understand needs and reduce harm.

Vulnerable adults may also need safeguarding support where there is neglect, exploitation, coercion, violence, impaired capacity or inability to protect themselves. Contact the relevant local authority safeguarding service for advice, or emergency services when danger is immediate.

Do not promise a child that you will keep dangerous information secret. Explain, in age-appropriate language, that you may need to involve a safe professional to help.

## How families can support treatment and recovery

Family involvement is most useful when it is agreed, bounded and matched to the treatment plan. It should not turn a relative into an unpaid clinician, detox supervisor or permanent crisis manager.

### Before treatment

Relatives may help by providing an accurate history, identifying previous withdrawal or overdose, describing mental-health and safeguarding concerns, and clarifying practical barriers. A professional assessment should still speak directly with the person and form its own judgement.

### During treatment

With consent, a family member may learn how the programme works, attend selected sessions, support agreed routines, understand medicines at a general safety level, and know who to contact if risk changes. Family or social-network interventions should be delivered by practitioners trained and supervised in the method.

### At transitions

Risk can change after detox, residential discharge, relapse or a return home. A continuing-care plan should clarify appointments, medication responsibility, overdose and withdrawal risk, early warning signs, support contacts and what would trigger a higher level of care.

### If relapse occurs

Respond first to safety. Reduced tolerance can increase overdose risk after abstinence. Avoid shame, but do not minimise the event. Encourage prompt contact with the treatment team or an assessment service and review whether the current level of care still fits. The family can support re-engagement while maintaining boundaries.

### Choosing the level of care

Not everyone needs residential rehabilitation, and not everyone can be supported safely at home. Assessment may point towards local NHS or community treatment, medically supported withdrawal, structured online care, outpatient therapy, residential rehabilitation, [mental-health and addiction care](/resources/mental-health-and-addiction) or a combined pathway. The guide on [when a family should consider rehab](/resources/when-should-family-consider-rehab) and IRN's [treatment placement guidance](/treatment-placement) explain the decision factors.

## Support for your own wellbeing

You do not have to wait for the person to accept help before seeking support yourself.

### A separate family appointment

Ask a local alcohol or drug service whether it supports affected family members. Current UK alcohol guidance says support should be available even when the person drinking is not in treatment. A separate appointment can cover urgent needs, stress, coping, information, social support and further referrals.

### Your GP and mental health

Speak with your GP if stress is affecting sleep, mood, anxiety, physical health, work or daily functioning. If you need urgent mental-health support in England but there is no immediate danger, use NHS 111 online or call 111 and select the mental-health option. Call 999 or go to A&E where someone is in danger.

### Peer and voluntary support

The NHS lists UK support routes including FRANK, Adfam, Addiction Family Support, Families Anonymous and SMART Family & Friends. Alcohol-focused options also include Al-Anon, and NACOA supports people affected by a parent's drinking. Services differ in approach, eligibility, geography and meeting style, so it is reasonable to try more than one.

Peer support can reduce isolation and provide practical experience. It should not replace medical, safeguarding, domestic-abuse or mental-health care when those are needed.

### A carer's assessment

You may not call yourself a carer, particularly if the change happened gradually or you are a partner, parent, sibling, adult child or friend. NICE advises that unpaid adult carers should be told about their right to discuss their own needs with their local authority. Entitlements and processes vary across the four UK nations; ask your local authority or carer service about the assessment that applies where you live.

### Work, money and relationships

Family strain is often practical as well as emotional. Consider confidential advice about debt, benefits, employment, housing or legal issues where relevant. Protect important documents, accounts and children's essentials where it is safe and lawful to do so. Couples or family therapy may help some relationships, but it is not appropriate as a substitute for domestic-abuse support.

### Rest and ordinary life

Self-care is often described too vaguely. Make it concrete: sleep somewhere safe, keep your own medical appointments, eat regularly, speak to one trusted person, maintain contact outside the crisis and protect time when you are not monitoring the other adult. These actions do not mean you care less. They reduce the chance that the entire family becomes organised around addiction.

## Choosing family support in the UK

Before paying for a service, ask:

- Is the work for the family member, the person with the addiction, or both?
- What assessment occurs before advice is given?
- Who delivers the service, and what training and supervision do they have?
- How are domestic abuse, suicide risk, withdrawal, children and vulnerable adults handled?
- How does consent and confidentiality work for each participant?
- Does the provider promise treatment entry or recovery outcomes it cannot guarantee?
- Are costs, cancellations, referral relationships and commissions transparent?
- What happens if the person refuses help or needs urgent medical care?
- Is there a route to NHS, local authority, medical, mental-health or residential services when needed?

Avoid providers whose main message is that the family has caused the addiction or can guarantee recovery by following a formula. Good support respects both influence and limits: families can change their own responses and contribute to safer conditions, but the person's treatment outcome is not theirs to guarantee.

[CTA:/family-addiction-intervention-uk:Explore Family Addiction Guidance]
A confidential family conversation can help separate urgent risk from longer-term decisions, clarify safe boundaries and identify realistic treatment routes. Your loved one does not need to be ready for you to seek guidance for your own next steps.
[/CTA]

## A practical seven-day family plan

This plan is not a countdown to confrontation. It is a way to replace scattered worry with safer preparation.

**Day 1: Write down the current concerns.** Record recent events, immediate risks, substances or behaviours involved, withdrawal signs, children or vulnerable adults affected and what you do not yet know. Keep facts separate from assumptions.

**Day 2: Identify emergency thresholds.** Agree when you would call 999, NHS 111, a GP, a local crisis service or safeguarding team. Find the address and phone number of the local drug and alcohol service. If opioids may be involved, ask about take-home naloxone.

**Day 3: Get support for one family member.** Book a GP, family-support, peer-group or professional consultation. Do this even if the person with the addiction refuses help.

**Day 4: Agree two or three boundaries.** Choose boundaries that protect safety and are within your control. Consider legal or specialist advice where housing, money, domestic abuse or caring duties make a change risky.

**Day 5: Prepare one conversation.** Choose the time, write down two observations, one expression of concern and one proposed next step. Decide how you will end the conversation if it becomes unsafe.

**Day 6: Clarify treatment routes.** Identify the most proportionate first assessment and what alternatives exist if medical detox, mental-health care or residential treatment is indicated.

**Day 7: Review the family plan.** Decide who will do what, what information remains private, how children will be protected, and when the plan will be reviewed. Do not assign one exhausted relative every task.

## How Insight Recovery Network supports families

Insight Recovery Network helps adult relatives organise a complex situation into clearer decisions. A family conversation may cover risk, household impact, communication, boundaries, treatment readiness and realistic options. Where the person agrees to assessment, the next step can be matched to their needs rather than to one predetermined service.

IRN's [family addiction guidance](/family-addiction-intervention-uk) supports relatives preparing conversations, boundaries and next steps. A [confidential recovery assessment](/assessments) can help clarify the person's needs when they are willing to engage. If residential, detox or specialist care may be appropriate, [assessment-led treatment placement](/treatment-placement) can help compare suitable routes and disclose relevant referral relationships.

IRN is a private support and treatment-guidance service, not a regulated healthcare provider. It does not diagnose, prescribe, provide medical detox or deliver emergency care. Any treating provider remains responsible for its clinical assessment and admission decision. This page does not replace NHS, GP, safeguarding, domestic-abuse or crisis care.

## When to seek professional help

Seek professional advice promptly when:

- you do not know whether stopping alcohol or medication could cause dangerous withdrawal
- overdose, severe intoxication or repeated loss of consciousness has occurred
- suicidal thoughts, psychosis, severe depression, violence or serious confusion may be present
- children or vulnerable adults are affected by unsafe care, neglect, violence or exploitation
- domestic abuse or coercive control makes a conversation or boundary unsafe
- family members cannot agree on a safe response
- money, housing, work or health are being significantly affected
- the same crisis repeats despite promises and informal attempts to manage it
- the person wants help but the family cannot judge which level of care is appropriate
- your own sleep, mood, physical health or ability to function is deteriorating.

You do not need to wait until the situation is at its worst. An independent family appointment can be appropriate even when the person with the addiction is not ready to take part.`.trim(),
  },
] satisfies Article[];
