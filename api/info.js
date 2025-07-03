import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { uid, region } = req.query;

  if (!uid || !region) {
    return res.status(400).json({ error: 'Missing uid or region' });
  }

  try {
    const likeURL = `https://free-fire-like-vvip.vercel.app/like?uid=${uid}`;
    const infoURL = `https://freefireinfo.nepcoderapis.workers.dev/?uid=${uid}&region=${region}`;

    const [likeRes, infoRes] = await Promise.all([
      fetch(likeURL),
      fetch(infoURL)
    ]);

    const likeData = await likeRes.json();
    const infoData = await infoRes.json();

    const data = {
      uid,
      region: region.toUpperCase(),
      account_info: {
        name: infoData.AccountInfo?.AccountName || null,
        level: infoData.AccountInfo?.AccountLevel,
        exp: infoData.AccountInfo?.AccountEXP,
        last_login_unix: infoData.AccountInfo?.AccountLastLogin,
        created_at_unix: infoData.AccountInfo?.AccountCreateTime,
        likes: infoData.AccountInfo?.AccountLikes,
        diamond_cost: infoData.AccountInfo?.DiamondCost,
        avatar_id: infoData.AccountInfo?.AccountAvatarId,
        banner_id: infoData.AccountInfo?.AccountBannerId,
        pin_id: infoData.AccountInfo?.pinId,
        release_version: infoData.AccountInfo?.ReleaseVersion,
        title_id: infoData.AccountInfo?.Title,
        bp_badges: infoData.AccountInfo?.AccountBPBadges,
      },
      rank_info: {
        br_max_rank: infoData.AccountInfo?.BrMaxRank,
        br_rank_point: infoData.AccountInfo?.BrRankPoint,
        cs_max_rank: infoData.AccountInfo?.CsMaxRank,
        cs_rank_point: infoData.AccountInfo?.CsRankPoint,
        show_br: infoData.AccountInfo?.ShowBrRank,
        show_cs: infoData.AccountInfo?.ShowCsRank,
      },
      profile_info: {
        skin_color_id: infoData.AccountProfileInfo?.SkinColor,
        outfit_ids: infoData.AccountProfileInfo?.EquippedOutfit || [],
        skill_ids: infoData.AccountProfileInfo?.EquippedSkills || [],
      },
      pet_info: {
        pet_id: infoData.petInfo?.id,
        level: infoData.petInfo?.level,
        exp: infoData.petInfo?.exp,
        skin_id: infoData.petInfo?.skinId,
        selected_skill: infoData.petInfo?.selectedSkillId,
      },
      guild_info: {
        name: infoData.GuildInfo?.GuildName,
        id: infoData.GuildInfo?.GuildID,
        level: infoData.GuildInfo?.GuildLevel,
        owner_uid: infoData.GuildInfo?.GuildOwner,
        members: `${infoData.GuildInfo?.GuildMember}/${infoData.GuildInfo?.GuildCapacity}`,
      },
      captain_info: {
        name: infoData.captainBasicInfo?.nickname,
        level: infoData.captainBasicInfo?.level,
        exp: infoData.captainBasicInfo?.exp,
        likes: infoData.captainBasicInfo?.liked,
        cs_max_rank: infoData.captainBasicInfo?.csMaxRank,
        cs_rank_points: infoData.captainBasicInfo?.csRankingPoints,
        total_points: infoData.captainBasicInfo?.rankingPoints,
        weapons: infoData.captainBasicInfo?.EquippedWeapon || [],
        title_id: infoData.captainBasicInfo?.title,
        head_pic: infoData.captainBasicInfo?.headPic,
        pin: infoData.captainBasicInfo?.pinId,
        banner_id: infoData.captainBasicInfo?.bannerId,
      },
      credit_score: {
        score: infoData.creditScoreInfo?.creditScore,
        reward_state: infoData.creditScoreInfo?.rewardState,
        period_end: infoData.creditScoreInfo?.periodicSummaryEndTime,
      },
      social_info: {
        gender: infoData.socialinfo?.Gender,
        language: infoData.socialinfo?.AccountLanguage,
        mode_pref: infoData.socialinfo?.ModePreference,
        rank_display: infoData.socialinfo?.RankDisplay,
        signature: infoData.socialinfo?.AccountSignature,
      },
      like_info: {
        likes_before: likeData.likes_before,
        likes_after: likeData.likes_after,
        likes_added: likeData.likes_added,
        server: likeData.server_used,
        player: likeData.player,
        status: likeData.status,
        credits: likeData.credits,
      }
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Error', message: err.message });
  }
}
