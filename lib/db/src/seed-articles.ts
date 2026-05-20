import { db, articlesTable } from "./index";
import { eq } from "drizzle-orm";

const articles = [
  {
    slug: "why-cant-i-stop-how-addiction-works",
    title: "Why Can't I Stop, Even When I Want To? Understanding How Addiction Actually Works",
    excerpt:
      "If you have tried to stop drinking, using, or acting out and found that willpower was never enough, the problem was never your character. This article explains what addiction actually is, why willpower keeps losing, and what genuine recovery involves.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-05-19",
    readingTime: 12,
    category: "Addiction & Substances",
    image: "/article-why-cant-i-stop.png",
    published: true,
    content: `If you have ever sworn you would stop, meant it completely, and then watched yourself do the exact thing you swore off, you already know the most confusing part of addiction. It is not that you do not want to stop. It is that wanting to stop, even badly, often does not seem to be enough.

That experience leaves most people with a quiet, corrosive conclusion: there must be something wrong with me. Weak. Broken. Lacking whatever other people have.

That conclusion is wrong. Not kindly wrong. Factually wrong. And understanding why is the first real step in recovery, whether you are looking at alcohol, drugs, or a behaviour you cannot seem to put down.

This article explains what addiction actually is, why willpower keeps losing, and what genuine recovery involves.

## Is Addiction a Choice or a Disease?

This is one of the most searched questions about addiction, and the way it is usually framed creates a false choice.

Addiction is a disease in a specific, practical sense. It has recognisable symptoms. It follows a predictable course. It gets worse without intervention. And it responds to treatment. That is what the word disease is pointing at. It is not a metaphor and it is not an excuse.

Whether you prefer the word disease, condition, disorder, or pattern, the practical point is the same: addiction follows a recognisable mechanism and requires more than good intentions.

But calling it a disease does not mean you are powerless or broken for life. It means the opposite. It means this is a known condition with a known path through it. You do not get cured of addiction in the sense of it never having existed. You recover from it, which is a different and more durable thing. People carry the condition and, through sustained recovery, reach a point where it no longer governs their life in any practical way.

## Why Doesn't Willpower Work for Addiction?

Here is the part almost nobody explains clearly.

Your brain has an old, deep system that is not interested in your long-term goals, your values, your relationships, or your future. It is interested in one thing: relief now. It is fast, it is powerful, and it was running long before the reasoning part of you came online.

Addiction does not negotiate with the reasonable part of you. It goes underneath it. It hijacks that older, survival-driven system and convinces it that the substance or the behaviour is essential, in the same category as food or safety.

Once that has happened, you have a problem that logic cannot reach, because the part of you doing the demanding does not speak the language of logic. This is why you could know, with total clarity, that the thing was destroying you, and still move toward it. You were not stupid. You were not weak. You were a reasoning person trying to argue with a system that does not reason.

Willpower is the wrong tool for this, in the same way that determination does not set a broken bone. This is not a counsel of despair. It is the reason the right kind of help works when trying harder on your own did not.

## For Families: Why Promises Keep Breaking

If you are a family member watching this happen, it can look like the person simply does not care enough. But broken promises are often not evidence of a lack of love. They are evidence that the addiction is operating at a level deeper than intention.

That does not mean there should be no boundaries. It means boundaries and support need to be built around the reality of addiction, not around the hope that one emotional conversation will fix it.

## What Is Addiction Actually Doing for You?

This is the heart of it, and it is the idea that changes how recovery feels.

Addiction is not the pursuit of something bad. It is the pursuit of something good, by a route that destroys you.

Nobody develops an addiction because they want chaos and loss. They develop it because, at some point, the substance or the behaviour met a real need, and it met that need fast and reliably. The need to feel calm in a body that does not feel safe. The need to feel something when you have gone numb, or to stop feeling something unbearable. The need to belong, to escape, to rest, to feel in control of one thing.

None of those needs are wrong. Every human being has them. The need was never the problem. The problem is the route.

This is the sentence that the whole of recovery is built on: addiction meets legitimate needs in an illegitimate way.

Recovery is not about killing the need. The need is human and it is staying. Recovery is about meeting that same need through a route that does not cost you everything.

## What About Process Addiction? Gambling, Sex, Work, Food, Screens

Not every addiction involves a substance. Gambling, sex, work, food, spending, gaming, and the pursuit of intensity can all run on the identical mechanism. The brain is hijacked the same way. The legitimate need underneath is the same kind of need.

Process addictions are often harder to see and harder to treat, for one main reason. There is no test for a behaviour the way there is for a substance. So much more of the recovery depends on the honesty of the person doing it. That makes self-honesty not a nice-to-have but a load-bearing pillar of the work, alongside accountability, structure, and lifestyle change.

If you have been quietly wondering whether something that is not a substance has the same grip on you, the answer is that it can, and that it is treatable in the same way.

## Why Stopping Is Not the Same as Recovering

This is the distinction that matters most, and the one most people are never told.

Stopping the substance or the behaviour is necessary. It is not optional and it is not minor. But it is not the same thing as recovery, and confusing the two is where a lot of people get stuck.

Put it this way. Being sober stops the bleeding. Recovery is what heals the scar.

Stopping addresses the symptom. You cannot heal anything while the bleeding continues, so this matters enormously. But a wound that has stopped bleeding is not a wound that has healed. It is a wound that has been given the conditions to heal, if the actual healing work now happens.

The healing work is the rest of it. Understanding the mechanism. Meeting the legitimate need a different way. Accountability. The small daily things, done consistently. The lifestyle change. The honest look at why you turned there, and the deliberate pivot in the other direction. Recovery is not a single decision. It is a paradigm shift and a lifestyle shift.

That is good news, not bad. If you have stopped and still do not feel free, you are not failing. You have stopped the bleeding. The healing is a different process, and it is the one that actually gives you your life back.

[CTA:/contact:Speak Confidentially]
If this describes where you are, Insight Recovery Network can help you understand what is happening and what kind of support is appropriate — whether that is [online recovery support](/online-programme), [treatment placement](/treatment-placement), or [family guidance](/what-we-offer). You do not need to have the perfect words or a fully formed plan. You just need an honest starting point.
[/CTA]

## You Do Not Have to Work This Out Alone

If any of this has described your own experience, the most useful thing to know is this. The reason trying harder on your own has not worked is not a flaw in you. It is the nature of the thing itself. And it is precisely why structured, knowledgeable support makes the difference it does.

At Insight Recovery Network, this is the work. A [structured online recovery programme](/online-programme) built around how addiction actually functions, delivered by someone with both deep clinical experience and lived experience of recovery. Whether the issue is alcohol, drugs, or a behavioural addiction, the approach is the same: understand the mechanism, meet the real need a different way, and build a life the addiction is no longer running.

If you would like to understand more about [treatment placement](/treatment-placement), explore [digital recovery tools with Insight OS](/insight-os), or simply have a private conversation about where you are, the next step does not have to be dramatic. It just has to be a step.

[CTA:/contact:Speak Confidentially]
The need was always legitimate. There is a better way to meet it. A direct, honest conversation — no judgement, no script, no pressure — about where you are and what genuine recovery could look like for you. Reach out today.
[/CTA]`,
  },
  {
    slug: "understanding-alcohol-dependency",
    title: "Understanding Alcohol Dependency: Signs, Stages and What to Do Next",
    excerpt:
      "Alcohol dependency develops gradually, often beneath the surface of everyday life. Recognising the signs early can make a significant difference to the path ahead.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-04-28",
    readingTime: 7,
    category: "Addiction & Substances",
    published: true,
    content: `Alcohol dependency is one of the most prevalent and least understood forms of addiction. Unlike illicit drug use, alcohol exists within the fabric of social life — making it uniquely difficult to recognise when consumption has crossed from habit into dependence.

## What Is Alcohol Dependency?

Alcohol dependency — also referred to as alcohol use disorder (AUD) — is a chronic condition characterised by an inability to control drinking despite negative consequences. It exists on a spectrum, ranging from mild to severe, and involves both physical and psychological components.

Physical dependence means the body has adapted to the presence of alcohol and will produce withdrawal symptoms in its absence. Psychological dependence reflects the emotional reliance on alcohol to manage stress, anxiety, or emotional pain.

## Recognising the Signs

Early recognition is critical. Common indicators include:

- Drinking more or for longer than intended
- Repeated unsuccessful attempts to cut back
- Significant time spent drinking or recovering from its effects
- Cravings or strong urges to drink
- Continued drinking despite relationship, occupational, or health problems
- Tolerance — needing more alcohol to achieve the same effect
- Withdrawal symptoms such as anxiety, tremors, sweating, or insomnia when not drinking

It is important to note that someone can be physically dependent on alcohol without appearing to behave in ways that others would recognise as problematic. High-functioning dependency is common, particularly among professionals.

## The Stages of Dependency

**Stage 1 – Occasional misuse:** Drinking is episodic and often linked to social or emotional triggers. At this stage, the person retains control but begins to use alcohol as a coping mechanism.

**Stage 2 – Increased tolerance:** Regular consumption leads to increased tolerance. Larger quantities are required to feel the same effect, and the individual may begin drinking earlier in the day or in isolation.

**Stage 3 – Problematic dependence:** Physical and psychological withdrawal symptoms begin to appear. Drinking becomes necessary to function. Relationships, work performance, and health begin to suffer.

**Stage 4 – Severe dependency:** At this stage, alcohol is central to all daily functioning. Without medical support, abrupt cessation can be dangerous, even fatal.

## What To Do Next

If you recognise these signs in yourself or someone close to you, the most important thing to understand is that dependency is a medical condition — not a moral failure.

The next steps depend on the severity of dependency. For those with physical dependence, medically supervised detoxification is essential before any further treatment. Attempting to stop abruptly without medical oversight carries genuine health risks.

Following detox, structured treatment — whether residential or outpatient — addresses the underlying patterns and provides the tools to build a sustainable recovery.

We are here to help you understand the most appropriate pathway forward. A private and confidential conversation can be the first step.`,
  },
  {
    slug: "what-happens-in-residential-rehabilitation",
    title: "What Happens in Residential Rehabilitation?",
    excerpt:
      "Residential rehabilitation is often the most effective route for complex or severe addiction. Here is an honest account of what the process actually involves.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-04-14",
    readingTime: 8,
    category: "Treatment Options",
    published: true,
    content: `Residential rehabilitation — commonly referred to as 'rehab' — remains one of the most clinically effective environments for treating moderate to severe addiction. Yet it is also one of the most misunderstood, often shaped in public perception by dramatic portrayals rather than clinical reality.

This article offers a clear, honest account of what the process involves.

## What Is Residential Rehabilitation?

Residential rehabilitation is a structured, immersive treatment programme in which an individual lives within a clinical or therapeutic setting — typically for 28 days, although programmes of 60 or 90 days are common for more complex presentations. During this time, the individual is removed from their usual environment and supported through a combination of medical, therapeutic, and psychoeducational interventions.

## The First Phase: Detoxification

For individuals with physical dependence — whether to alcohol, opioids, benzodiazepines or other substances — the first phase of residential treatment is medically supervised detoxification. This is not the same as rehabilitation itself, though they are often provided sequentially within the same facility.

Medically supervised detox involves the careful management of withdrawal symptoms using pharmaceutical protocols, monitoring of vital signs, and 24-hour clinical oversight. The duration of detox varies depending on the substance and severity of dependence but typically lasts between 5 and 10 days.

## The Therapeutic Phase

Once stabilised, the individual enters the substantive therapeutic component of the programme. This typically includes:

**Individual psychotherapy:** One-to-one sessions with a therapist or counsellor to explore the underlying drivers of addictive behaviour, address trauma, and develop personalised relapse prevention strategies.

**Group therapy:** Daily structured group sessions provide an opportunity to develop peer connection, challenge distorted thinking, and build communication skills in a safe environment.

**Psychoeducation:** Educational sessions covering topics such as the neuroscience of addiction, triggers and craving management, family dynamics, and the process of recovery.

**Complementary therapies:** Many high-quality facilities offer trauma-focused adjuncts such as EMDR, yoga, mindfulness, equine therapy, or art therapy. These are not frivolous additions — for many people, trauma is at the root of their addiction.

**Family involvement:** Where appropriate, family members are invited into the treatment process through sessions designed to repair relationships and equip those around the individual with the knowledge to provide appropriate support post-discharge.

## What Does a Typical Day Look Like?

Structure is itself therapeutic. Days in residential treatment are carefully designed to re-establish routine, which is often absent in the lives of those struggling with addiction. A typical day might begin with a morning check-in or mindfulness practice, move through several group and individual sessions, include peer mealtimes and supervised recreation, and end with an evening reflection group.

The absence of phones and external stressors — while potentially difficult at first — creates the contained environment that deep therapeutic work requires.

## After Residential Treatment

The transition from residential care to everyday life is a critical juncture. Quality facilities invest significant time in aftercare planning, which typically includes:

- Establishing an ongoing therapeutic relationship (counsellor, psychotherapist, or psychiatrist)
- Engagement with community-based support such as 12-step or SMART Recovery meetings
- A structured relapse prevention plan
- Regular check-ins or digital recovery tools to maintain accountability and structure

## Is Residential Rehabilitation Right for Everyone?

Not necessarily. Residential treatment is most appropriate for those with moderate to severe dependency, complex presentations, or those for whom previous outpatient attempts have been unsuccessful. Others may do well with structured online support, intensive outpatient treatment, or a combination of approaches.

The most important thing is matching the right level of care to the individual's specific needs. We help people and families navigate exactly this question.`,
  },
  {
    slug: "managing-relapse-part-of-recovery",
    title: "Managing Relapse: Why It Is Part of Recovery, Not the End of It",
    excerpt:
      "Relapse is one of the most misunderstood aspects of addiction. Understanding it clinically — rather than morally — changes everything about how we respond to it.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-03-31",
    readingTime: 6,
    category: "Recovery & Wellbeing",
    published: true,
    content: `Relapse is perhaps the most emotionally charged word in the language of addiction. For the person in recovery, it can feel like complete failure. For family members, it can bring overwhelming despair. And yet, clinically speaking, relapse is a well-understood feature of a chronic condition — not a sign that recovery is impossible.

## Relapse as a Medical Reality

Addiction shares features with other chronic medical conditions such as hypertension, diabetes, and asthma. All of these conditions involve periods of symptom management, occasional deterioration, and the need for ongoing treatment adjustment. We do not consider someone a failure for requiring medication adjustments when their blood pressure rises again. The same framework must apply to addiction.

According to published research, relapse rates for substance use disorders range from 40 to 60 per cent — comparable to those of other chronic illnesses. This is not a statement about inevitable failure. It is a clinical acknowledgement that recovery is rarely a straight line.

## The Stages of Relapse

Relapse does not happen in an instant. It typically unfolds across three stages, often referred to as emotional, mental, and physical relapse.

**Emotional relapse** occurs when someone is not actively thinking about using, but their behaviours and emotional state are setting the conditions for future use. This might include neglecting self-care, isolating from support, suppressing difficult emotions, or not attending therapy or meetings.

**Mental relapse** is characterised by increasingly conscious thoughts about using. The person begins to glamorise past use, minimise the consequences, and bargain internally about whether 'controlled' use might be possible.

**Physical relapse** is the act of using. At this stage, early intervention is significantly more effective than waiting.

## Why Recognising the Stages Matters

One of the most valuable skills developed in recovery is the ability to identify early warning signs — in oneself and, for families, in a loved one. Catching relapse at the emotional or mental stage, before physical use occurs, allows for meaningful intervention.

This is one reason structured aftercare and ongoing therapeutic support is so important. Regular check-ins, journalling, and digital recovery tools can help identify drifting patterns before they reach crisis point.

## Responding to Physical Relapse

If physical relapse has occurred, the most important response is one of calm, practical action rather than moral condemnation. The conversation should focus on safety first, then understanding what happened, and then adjusting the recovery plan accordingly.

For some people, a short return to residential or intensive outpatient treatment may be appropriate. For others, a review and strengthening of their existing support structure is sufficient. The key is responding quickly, rather than allowing shame to prevent engagement with support.

## The Role of Shame

Shame is one of the most powerful drivers of continued use following a relapse. The internal narrative of 'I've blown it, so I might as well continue' is dangerously common. Treatment approaches that address shame directly — including certain trauma-focused therapies — are essential in breaking this cycle.

Families, too, can inadvertently amplify shame through reactions that, though understandable, communicate disappointment, anger, or withdrawal of support at the moment they are most needed.

## A Compassionate Framework

Understanding relapse as a clinical event rather than a moral failing does not mean minimising its consequences. It means responding to it in the way most likely to support a return to recovery. That requires compassion, structure, and appropriate clinical support.

We are here to help you navigate exactly this — whether you are the person who has relapsed, or someone supporting them through it.`,
  },
  {
    slug: "supporting-a-loved-one-through-recovery",
    title: "Supporting a Loved One Through Recovery: What Helps and What Does Not",
    excerpt:
      "Watching someone you care about struggle with addiction is one of the most distressing experiences a family can face. Knowing how to respond — and what to avoid — can make a real difference.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-03-17",
    readingTime: 7,
    category: "Family & Relationships",
    published: true,
    content: `When someone you love is struggling with addiction, your instinct is to help. Yet the ways in which family members respond — however well-intentioned — can sometimes make the situation harder. This article offers a practical and compassionate guide to what actually helps, and what tends to create additional difficulty.

## Understanding Your Own Position First

Before addressing how to support someone else, it is worth acknowledging the position you are in. Loving someone with an addiction is exhausting. It involves sustained emotional strain, uncertainty, and often significant disruption to your own life. Recognising this — and seeking support for yourself — is not secondary to helping your loved one. It is essential to it.

Family members who are burned out, overwhelmed, or themselves psychologically depleted are less able to provide the calm, consistent support that recovery requires. Many people find that working with a therapist or counsellor — independently of their loved one — makes a meaningful difference.

## What Helps

**Educating yourself:** Addiction is a complex condition with a neurobiological basis. Understanding how it works — including concepts such as tolerance, withdrawal, craving, and relapse — significantly shifts how you interpret behaviour. Many things that feel like choices or deliberate acts of cruelty are better understood as symptoms of a condition.

**Maintaining boundaries:** Boundaries are not punishments. They are clear statements of what you are able to do and not do, and they protect both you and your loved one. A boundary might be: "I will not give you money if I believe it will be used to purchase alcohol." Communicating this clearly and calmly — and maintaining it consistently — is more helpful than inconsistent responses.

**Expressing concern without ultimatums:** Telling someone how you feel — "I am frightened for you and I love you" — is more likely to open dialogue than confrontational ultimatums. Framing concern in terms of your own experience, rather than accusations, tends to be better received.

**Seeking support for yourself:** Al-Anon, SMART Recovery Family and Friends, and individual therapy are all well-evidenced sources of support for family members. You do not have to navigate this alone.

## What Does Not Help

**Enabling:** Enabling refers to behaviour that, however well-intentioned, removes the natural consequences of addiction and thereby reduces the incentive to change. Examples include covering financial losses, making excuses to employers or other family members, or providing accommodation without clear expectations. Enabling is not the same as support.

**Ultimatums without follow-through:** Ultimatums that are not maintained undermine your credibility and, more importantly, reduce the motivation for change. If you set a boundary, it must be real.

**Taking responsibility for their recovery:** Recovery is something the individual must ultimately choose and sustain for themselves. You can support the conditions for it. You cannot do it on their behalf.

**Minimising or catastrophising:** Both extremes — "it's not that bad" and "you're destroying everything" — tend to create defensiveness rather than openness. Measured, honest, and compassionate communication tends to be most effective.

## When to Seek Professional Help

If you are concerned about someone's drinking or drug use, professional guidance — whether a GP, an addiction specialist, or an organisation such as Insight Recovery Network — can help you understand what is happening and how best to respond.

We can help you navigate this, and identify the most appropriate treatment environment for your specific situation.`,
  },
  {
    slug: "online-recovery-programmes",
    title: "Online Recovery Programmes: Who Are They For and Do They Work?",
    excerpt:
      "Digital recovery support has matured significantly in recent years. For many people, structured online programmes offer a clinically effective alternative to in-person treatment.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-02-10",
    readingTime: 5,
    category: "Treatment Options",
    published: true,
    content: `Online recovery programmes have evolved considerably. What was once a fringe option — often dismissed as a poor substitute for 'real' treatment — is now a well-evidenced, clinically structured pathway that suits a substantial proportion of people seeking support for addiction and mental health challenges.

## What Has Changed

The shift has been driven by several converging factors. The acceleration of digital health during the pandemic demonstrated that therapeutic relationships can be effectively maintained at a distance. Research into telehealth outcomes has consistently shown that for many presentations, outcomes are comparable to in-person delivery.

Simultaneously, the quality and structure of online recovery programmes has improved. The best programmes are not simply virtual replicas of in-person treatment — they are thoughtfully designed to leverage the specific advantages of digital delivery while compensating for its limitations.

## Who Are Online Programmes Suited To?

Online recovery support is most appropriate for individuals who:

**Do not have significant physical dependence:** Online programmes are not designed to manage acute withdrawal. Anyone with physical dependence on alcohol, benzodiazepines, or opioids will require medically supervised detoxification before engaging with a structured programme.

**Have a degree of stability in their environment:** Effective engagement with online therapeutic content requires a reasonably stable physical environment — somewhere private, consistent, and free from immediate crisis.

**Have professional or family commitments that make residential treatment impractical:** One of the most significant advantages of online delivery is that it does not require an individual to step out of their life. Parents, working professionals, and individuals with caring responsibilities often find residential treatment logistically impossible. Structured online support allows treatment to be integrated into daily life.

**Are earlier in their dependency trajectory:** For those in the early stages of problematic use, or those who have completed residential treatment and need structured ongoing support, online programmes provide an accessible and proportionate level of care.

**Are geographically remote:** For individuals in areas with limited access to specialist treatment services, online delivery significantly expands what is available.

## What Good Online Recovery Support Looks Like

Quality online programmes share several characteristics:

**Clinical oversight:** There should be qualified clinicians — addiction specialists, psychologists, or psychiatrists — involved in programme design and, where appropriate, individual care.

**Structured therapeutic content:** Effective programmes draw on evidence-based therapeutic modalities, including cognitive behavioural therapy (CBT), motivational enhancement, and relapse prevention frameworks — not simply peer sharing or unstructured discussion.

**Group connection:** Peer support remains one of the most powerful components of recovery. Well-designed online programmes incorporate facilitated group sessions that create genuine connection and mutual accountability.

**Individual support:** Access to one-to-one support — whether through scheduled sessions or responsive check-ins — is important for addressing the specific needs and challenges that arise for each individual.

**Digital recovery tools:** Features such as journalling, mood tracking, trigger mapping, and structured goal-setting help individuals maintain insight and engagement between sessions.

## Our Online Programme and Insight OS

Insight Recovery Network offers a structured online recovery programme that incorporates facilitated group sessions, individual support, and psychoeducational content — alongside Insight OS, our dedicated digital recovery platform for daily check-ins, journalling, and recovery planning.

If you would like to understand whether an online programme is appropriate for your situation, we would be glad to speak with you confidentially.`,
  },
];

async function seed() {
  console.log("Seeding articles...");
  let inserted = 0;
  let skipped = 0;

  for (const article of articles) {
    try {
      const existing = await db
        .select({ id: articlesTable.id })
        .from(articlesTable)
        .where(eq(articlesTable.slug, article.slug));

      if (existing.length > 0) {
        console.log(`Skipping existing: ${article.slug}`);
        skipped++;
        continue;
      }

      await db.insert(articlesTable).values({
        ...article,
        updatedAt: new Date(),
      });
      console.log(`Inserted: ${article.slug}`);
      inserted++;
    } catch (err) {
      console.error(`Failed to insert ${article.slug}:`, err);
    }
  }

  console.log(`Done. Inserted: ${inserted}, Skipped: ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
