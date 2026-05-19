'use client';

import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import { Save } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  FaGlobeAmericas,
  FaPassport,
  FaPhoneSquare,
  FaRegTrashAlt,
  FaTelegramPlane,
  FaTshirt,
  FaWhatsapp,
} from 'react-icons/fa';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import {
  GiBodyHeight,
  GiBodySwapping,
  GiConverseShoe,
  GiGraduateCap,
  GiMonclerJacket,
  GiUnderwearShorts,
} from 'react-icons/gi';
import { PiPantsFill } from 'react-icons/pi';
import { GrCertificate, GrDocumentText } from 'react-icons/gr';
import { MdDiversity2, MdEventAvailable, MdOutlinePlace } from 'react-icons/md';
import { BsFiles } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAddressByZipCode } from '@/hooks/use-address-by-zipcode';
import { useAuth } from '@/hooks/use-auth';
import { UpdateMeRequest } from '@/services/auth/auth.types';
import { UploadService } from '@/services/upload/upload.service';
import { useFlashMessage } from '@/contexts/flash-message-context';
import {
  ProductRoleEnum,
  EthnicityTypeEnum,
  GenderIdentityEnum,
  SexualOrientationEnum,
  ClothingSizeEnum,
  ShoesSizeUnitEnum,
  AvailabilityShiftEnum,
  CandidateProfileEntity,
  CourseTypeEnum,
} from '@/types/entities/user.entity';
import { RecruiterProfileForm } from '@/components/profile/recruiter-profile-form';
import { ProfileSectionTitle } from '@/components/profile/profile-section-title';
import { PhoneInput } from '@/components/form/phone-input';

type ProfileTranslator = ReturnType<typeof useTranslations>;

function formatBirthday(value?: string | Date, locale = 'pt-BR') {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(locale);
}

function getEthnicityLabel(value: EthnicityTypeEnum, t: ProfileTranslator) {
  return {
    [EthnicityTypeEnum.INDIGENOUS]: t('ethnicityIndigenous'),
    [EthnicityTypeEnum.WHITE]: t('ethnicityWhite'),
    [EthnicityTypeEnum.BLACK]: t('ethnicityBlack'),
    [EthnicityTypeEnum.BROWN]: t('ethnicityBrown'),
    [EthnicityTypeEnum.ASIAN]: t('ethnicityAsian'),
    [EthnicityTypeEnum.OTHER]: t('other'),
  }[value];
}

function getGenderIdentityLabel(value: GenderIdentityEnum, t: ProfileTranslator) {
  return {
    [GenderIdentityEnum.MALE]: t('genderMale'),
    [GenderIdentityEnum.FEMALE]: t('genderFemale'),
    [GenderIdentityEnum.NON_BINARY]: t('genderNonBinary'),
    [GenderIdentityEnum.TRANS_MALE]: t('genderTransMale'),
    [GenderIdentityEnum.TRANS_FEMALE]: t('genderTransFemale'),
    [GenderIdentityEnum.AGENDER]: t('genderAgender'),
    [GenderIdentityEnum.GENDERFLUID]: t('genderFluid'),
    [GenderIdentityEnum.GENDERQUEER]: t('genderQueer'),
    [GenderIdentityEnum.INTERSEX]: t('genderIntersex'),
    [GenderIdentityEnum.OTHER]: t('other'),
    [GenderIdentityEnum.PREFER_NOT_TO_SAY]: t('preferNotToSay'),
  }[value];
}

function getSexualOrientationLabel(value: SexualOrientationEnum, t: ProfileTranslator) {
  return {
    [SexualOrientationEnum.HETEROSEXUAL]: t('orientationHeterosexual'),
    [SexualOrientationEnum.HOMOSEXUAL]: t('orientationHomosexual'),
    [SexualOrientationEnum.LESBIAN]: t('orientationLesbian'),
    [SexualOrientationEnum.GAY]: t('orientationGay'),
    [SexualOrientationEnum.BISEXUAL]: t('orientationBisexual'),
    [SexualOrientationEnum.PANSEXUAL]: t('orientationPansexual'),
    [SexualOrientationEnum.ASEXUAL]: t('orientationAsexual'),
    [SexualOrientationEnum.DEMISEXUAL]: t('orientationDemisexual'),
    [SexualOrientationEnum.QUEER]: t('orientationQueer'),
    [SexualOrientationEnum.QUESTIONING]: t('orientationQuestioning'),
    [SexualOrientationEnum.OTHER]: t('other'),
    [SexualOrientationEnum.PREFER_NOT_TO_SAY]: t('preferNotToSay'),
  }[value];
}

function getAvailabilityShiftLabel(value: AvailabilityShiftEnum, t: ProfileTranslator) {
  return {
    [AvailabilityShiftEnum.EARLY_MORNING]: t('earlyMorning'),
    [AvailabilityShiftEnum.MORNING]: t('morning'),
    [AvailabilityShiftEnum.AFTERNOON]: t('afternoon'),
    [AvailabilityShiftEnum.EVENING]: t('evening'),
    [AvailabilityShiftEnum.NIGHT]: t('night'),
    [AvailabilityShiftEnum.FULL_DAY]: t('fullDay'),
    [AvailabilityShiftEnum.FLEXIBLE]: t('flexible'),
  }[value];
}

function hasValue(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

const candidateProfileSections: Array<{
  id: string;
  titleKey: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: 'dados-basicos', titleKey: 'basicData', icon: GrDocumentText },
  { id: 'telefone', titleKey: 'phone', icon: FaPhoneSquare },
  { id: 'endereco', titleKey: 'address', icon: MdOutlinePlace },
  { id: 'documentos', titleKey: 'documents', icon: FaPassport },
  { id: 'midia', titleKey: 'media', icon: BsFiles },
  { id: 'etnia', titleKey: 'ethnicity', icon: FaGlobeAmericas },
  { id: 'diversidade', titleKey: 'diversity', icon: MdDiversity2 },
  { id: 'atributos-fisicos', titleKey: 'physicalAttributes', icon: GiBodyHeight },
  { id: 'uniforme', titleKey: 'uniform', icon: GiBodySwapping },
  { id: 'formacao', titleKey: 'education', icon: GiGraduateCap },
  { id: 'experiencias-profissionais', titleKey: 'professionalExperiences', icon: GrCertificate },
  { id: 'disponibilidade', titleKey: 'availability', icon: MdEventAvailable },
];

type CandidateProfileSectionId =
  | 'dados-basicos'
  | 'telefone'
  | 'endereco'
  | 'documentos'
  | 'midia'
  | 'etnia'
  | 'diversidade'
  | 'atributos-fisicos'
  | 'uniforme'
  | 'formacao'
  | 'experiencias-profissionais'
  | 'disponibilidade';

type CandidateProfileCompletion = Record<CandidateProfileSectionId, boolean>;

function getCandidateProfileCompletion({
  name,
  email,
  birthday,
  profile,
}: {
  name?: string;
  email?: string;
  birthday?: string | Date;
  profile?: CandidateProfileEntity;
}): CandidateProfileCompletion {
  return {
    'dados-basicos': [name, email, birthday].every(hasValue),
    telefone: [profile?.contacts?.phone?.country, profile?.contacts?.phone?.number].every(hasValue),
    endereco: [
      profile?.contacts?.address?.zipCode,
      profile?.contacts?.address?.street,
      profile?.contacts?.address?.number,
      profile?.contacts?.address?.neighborhood,
      profile?.contacts?.address?.city,
      profile?.contacts?.address?.state,
      profile?.contacts?.address?.country,
    ].every(hasValue),
    documentos: hasValue(profile?.documents?.cpf?.number),
    midia: hasValue(profile?.media?.resumeUrl),
    etnia: hasValue(profile?.ethnicity),
    diversidade: [profile?.diversity?.genderIdentity, profile?.diversity?.sexualOrientation].every(
      hasValue,
    ),
    'atributos-fisicos': [
      profile?.physicalAttributes?.height,
      profile?.physicalAttributes?.weight,
    ].every(hasValue),
    uniforme: [
      profile?.uniform?.tShirtSize,
      profile?.uniform?.jacketSize,
      profile?.uniform?.shortSize,
      profile?.uniform?.pantsSize,
      profile?.uniform?.shoeSizeUnit,
      profile?.uniform?.shoeSize,
    ].every(hasValue),
    formacao:
      Boolean(profile?.educations?.length) &&
      Boolean(
        profile?.educations?.every(
          (education) =>
            hasValue(education.courseType) &&
            hasValue(education.courseName) &&
            hasValue(education.institution) &&
            hasValue(education.startYear) &&
            (education.isOngoing || hasValue(education.endYear)),
        ),
      ),
    'experiencias-profissionais':
      Boolean(profile?.professionalExperiences?.length) &&
      Boolean(
        profile?.professionalExperiences?.every(
          (experience) =>
            hasValue(experience.companyName) &&
            hasValue(experience.role) &&
            hasValue(experience.startYear) &&
            (experience.isCurrent || hasValue(experience.endYear)),
        ),
      ),
    disponibilidade: Array.isArray(profile?.availability) && profile.availability.length > 0,
  };
}

export function ProfileForm() {
  const { user } = useAuth();

  if (user?.productRole === ProductRoleEnum.RECRUITER) {
    return <RecruiterProfileForm />;
  }

  return <CandidateProfileForm />;
}

export function CandidateProfileForm() {
  const t = useTranslations('Profile');
  const locale = useLocale();
  const { user, updateMe } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const {
    searchZipCode,
    clearError: clearZipCodeError,
    isLoading: isZipCodeLoading,
    error: zipCodeError,
  } = useAddressByZipCode();
  const currentYear = new Date().getFullYear();
  const courseTypeOptions = Object.values(CourseTypeEnum).map((value) => ({
    value,
    label: {
      [CourseTypeEnum.HIGH_SCHOOL]: t('courseHighSchool'),
      [CourseTypeEnum.TECHNICAL]: t('courseTechnical'),
      [CourseTypeEnum.TECHNOLOGIST]: t('courseTechnologist'),
      [CourseTypeEnum.BACHELOR]: t('courseBachelor'),
      [CourseTypeEnum.LICENTIATE]: t('courseLicentiate'),
      [CourseTypeEnum.POSTGRADUATE]: t('coursePostgraduate'),
      [CourseTypeEnum.MASTER]: t('courseMaster'),
      [CourseTypeEnum.DOCTORATE]: t('courseDoctorate'),
      [CourseTypeEnum.OTHER]: t('other'),
    }[value],
  }));
  const savedProfileCompletionBySection = useMemo(
    () =>
      getCandidateProfileCompletion({
        name: user?.name,
        email: user?.email,
        birthday: user?.birthday,
        profile: user?.candidateProfile,
      }),
    [user?.birthday, user?.candidateProfile, user?.email, user?.name],
  );
  const [completedSectionOverrides, setCompletedSectionOverrides] = useState<
    Partial<CandidateProfileCompletion>
  >({});
  const visibleProfileCompletionBySection = useMemo(
    () => ({
      ...savedProfileCompletionBySection,
      ...completedSectionOverrides,
    }),
    [completedSectionOverrides, savedProfileCompletionBySection],
  );
  const [showBasic, setShowBasic] = useState(!savedProfileCompletionBySection['dados-basicos']);
  const [showPhone, setShowPhone] = useState(!savedProfileCompletionBySection.telefone);
  const [showAddress, setShowAddress] = useState(!savedProfileCompletionBySection.endereco);
  const [showContacts, setShowContacts] = useState(!savedProfileCompletionBySection.documentos);
  const [showMedia, setShowMedia] = useState(!savedProfileCompletionBySection.midia);
  const [showEthnicity, setShowEthnicity] = useState(!savedProfileCompletionBySection.etnia);
  const [showDiversity, setShowDiversity] = useState(!savedProfileCompletionBySection.diversidade);
  const [showPhysicalAttributes, setShowPhysicalAttributes] = useState(
    !savedProfileCompletionBySection['atributos-fisicos'],
  );
  const [showUniform, setShowUniform] = useState(!savedProfileCompletionBySection.uniforme);
  const [showEducation, setShowEducation] = useState(!savedProfileCompletionBySection.formacao);
  const [showExperiences, setShowExperiences] = useState(
    !savedProfileCompletionBySection['experiencias-profissionais'],
  );
  const [showAvailability, setShowAvailability] = useState(
    !savedProfileCompletionBySection.disponibilidade,
  );
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [educationIndexToDelete, setEducationIndexToDelete] = useState<number | null>(null);
  const [experienceIndexToDelete, setExperienceIndexToDelete] = useState<number | null>(null);
  const [educationDraft, setEducationDraft] = useState({
    isOngoing: false,
    courseType: '',
    courseName: '',
    institution: '',
    startYear: currentYear,
    endYear: currentYear,
  });
  const [experienceDraft, setExperienceDraft] = useState({
    isCurrent: false,
    companyName: '',
    role: '',
    startYear: currentYear,
    endYear: currentYear,
  });
  const boxClassName =
    'rounded-[1.75rem] border border-zinc-800 bg-black/90 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.36)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_52px_rgba(0,0,0,0.4)]';
  const fieldClassName =
    'rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 placeholder:text-zinc-500';
  const labelClassName = 'text-zinc-300';
  const sectionTitleClassName = 'uppercase text-lime-400';
  const sectionIconClassName = 'text-lime-400';
  const sectionToggleIconClassName = 'text-zinc-500';
  const saveButtonClassName =
    'rounded-xl border-lime-500/20 bg-lime-500/10 text-lime-300 hover:bg-lime-500/15';
  const nestedCardClassName =
    'rounded-2xl border border-zinc-800 bg-black/75 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.24)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-lime-300/20';
  const modalCardClassName =
    'w-full max-w-3xl rounded-[1.75rem] border border-zinc-800 bg-black/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur';
  const optionCardClassName =
    'flex items-center gap-3 rounded-xl border border-zinc-800 bg-black/70 px-4 py-3 text-zinc-100 transition-all duration-300 hover:border-lime-400/30 hover:bg-zinc-900';
  const stepperButtonClassName =
    'flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-black/70 text-zinc-100 transition-all duration-300 hover:border-lime-400/30 hover:bg-zinc-900 hover:text-lime-300 disabled:cursor-not-allowed disabled:opacity-40';
  const numericInputClassName =
    'w-full appearance-none bg-transparent text-center text-zinc-200 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
  const modalHeadingClassName =
    'flex items-center gap-3 text-xl font-semibold uppercase tracking-[0.16em] text-zinc-100';
  const modalCloseButtonClassName =
    'text-2xl leading-none text-zinc-500 transition-colors hover:text-zinc-100';
  const modalDescriptionClassName = 'text-sm text-zinc-400';
  const nestedSectionTitleClassName =
    'mb-4 text-lg font-semibold uppercase tracking-[0.16em] text-zinc-100';

  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMeRequest>({
    defaultValues: {
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    },
  });
  useEffect(() => {
    reset({
      name: user?.name,
      birthday: user?.birthday,
      candidateProfile: user?.candidateProfile,
    });
  }, [reset, user]);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'candidateProfile.educations',
  });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'candidateProfile.professionalExperiences',
  });
  const nextEducationNumber = String(educationFields.length + 1).padStart(2, '0');
  const nextExperienceNumber = String(experienceFields.length + 1).padStart(2, '0');
  const zipCodeField = register('candidateProfile.contacts.address.zipCode');

  async function submitCandidateUpdate(
    payload: UpdateMeRequest,
    successMessage: string,
    errorMessage: string,
  ) {
    try {
      await updateMe(payload);
      showSuccess(successMessage);
      return true;
    } catch {
      showError(errorMessage);
      return false;
    }
  }

  const heightValue = useWatch({
    control,
    name: 'candidateProfile.physicalAttributes.height',
  });
  const weightValue = useWatch({
    control,
    name: 'candidateProfile.physicalAttributes.weight',
  });
  const shoeSizeValue = useWatch({
    control,
    name: 'candidateProfile.uniform.shoeSize',
  });
  const shoeSizeUnitValue = useWatch({
    control,
    name: 'candidateProfile.uniform.shoeSizeUnit',
  });
  const phoneCountryValue = useWatch({
    control,
    name: 'candidateProfile.contacts.phone.country',
  });
  const phoneNumberValue = useWatch({
    control,
    name: 'candidateProfile.contacts.phone.number',
  });
  const resumeUrlValue = useWatch({
    control,
    name: 'candidateProfile.media.resumeUrl',
  });
  const hasShoeSizeUnit = Boolean(shoeSizeUnitValue);
  const getSectionBoxClassName = (sectionId: CandidateProfileSectionId) =>
    `${boxClassName} scroll-mt-24 ${
      visibleProfileCompletionBySection[sectionId]
        ? '!border-lime-400/60 shadow-[0_0_0_1px_rgba(163,230,53,0.16),0_18px_50px_rgba(0,0,0,0.36)] hover:!border-lime-300/80'
        : ''
    }`;
  const markSectionComplete = (sectionId: CandidateProfileSectionId) => {
    setCompletedSectionOverrides((current) => ({
      ...current,
      [sectionId]: true,
    }));
  };

  function updateNumericField(
    field:
      | 'candidateProfile.physicalAttributes.height'
      | 'candidateProfile.physicalAttributes.weight'
      | 'candidateProfile.uniform.shoeSize',
    currentValue: number | undefined,
    delta: number,
    min = 0,
    precision = 1,
  ) {
    const nextValue = Math.max(min, Number((Number(currentValue || 0) + delta).toFixed(precision)));
    setValue(field, nextValue, { shouldDirty: true, shouldTouch: true });
  }

  async function handleZipCodeLookup(zipCode?: string) {
    const result = await searchZipCode(zipCode || '');

    if (!result) {
      return;
    }

    setValue('candidateProfile.contacts.address.street', result.street, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.complement', result.complement, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.neighborhood', result.neighborhood, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.city', result.city, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('candidateProfile.contacts.address.state', result.state, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function updateEducationDraftYear(field: 'startYear' | 'endYear', delta: number) {
    setEducationDraft((current) => ({
      ...current,
      [field]: Math.max(1900, current[field] + delta),
    }));
  }

  function resetEducationDraft() {
    setEducationDraft({
      isOngoing: false,
      courseType: '',
      courseName: '',
      institution: '',
      startYear: currentYear,
      endYear: currentYear,
    });
  }

  function updateExperienceDraftYear(field: 'startYear' | 'endYear', delta: number) {
    setExperienceDraft((current) => ({
      ...current,
      [field]: Math.max(1900, current[field] + delta),
    }));
  }

  function resetExperienceDraft() {
    setExperienceDraft({
      isCurrent: false,
      companyName: '',
      role: '',
      startYear: currentYear,
      endYear: currentYear,
    });
  }

  function handleOpenEducationModal() {
    resetEducationDraft();
    setIsEducationModalOpen(true);
  }

  function handleOpenExperienceModal() {
    resetExperienceDraft();
    setIsExperienceModalOpen(true);
  }

  function handleSaveEducation() {
    if (!educationDraft.courseName.trim() || !educationDraft.institution.trim()) {
      showError(t('educationRequired'));
      return;
    }

    if (!educationDraft.courseType) {
      showError(t('courseTypeRequired'));
      return;
    }

    const nextEducation = {
      courseName: educationDraft.courseName.trim(),
      institution: educationDraft.institution.trim(),
      startYear: educationDraft.startYear,
      endYear: educationDraft.isOngoing ? undefined : educationDraft.endYear,
      courseType: educationDraft.courseType as CourseTypeEnum,
      isOngoing: educationDraft.isOngoing,
    };

    const nextEducations = [...(getValues('candidateProfile.educations') || []), nextEducation];

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          educations: nextEducations,
        },
      },
      t('educationSaveSuccess'),
      t('educationSaveError'),
    ).then((saved) => {
      if (!saved) {
        return;
      }

      appendEducation(nextEducation);
      markSectionComplete('formacao');
      setShowEducation(false);
      setIsEducationModalOpen(false);
      resetEducationDraft();
    });
  }

  function handleSaveExperience() {
    if (!experienceDraft.companyName.trim() || !experienceDraft.role.trim()) {
      showError(t('experienceRequired'));
      return;
    }

    const nextExperience = {
      companyName: experienceDraft.companyName.trim(),
      role: experienceDraft.role.trim(),
      startYear: experienceDraft.startYear,
      endYear: experienceDraft.isCurrent ? undefined : experienceDraft.endYear,
      isCurrent: experienceDraft.isCurrent,
    };

    const nextExperiences = [
      ...(getValues('candidateProfile.professionalExperiences') || []),
      nextExperience,
    ];

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          professionalExperiences: nextExperiences,
        },
      },
      t('experienceSaveSuccess'),
      t('experienceSaveError'),
    ).then((saved) => {
      if (!saved) {
        return;
      }

      appendExperience(nextExperience);
      markSectionComplete('experiencias-profissionais');
      setShowExperiences(false);
      setIsExperienceModalOpen(false);
      resetExperienceDraft();
    });
  }

  function handleSaveBasic() {
    void submitCandidateUpdate(
      { name: getValues('name') },
      t('basicDataSuccess'),
      t('basicDataError'),
    ).then((saved) => {
      if (saved && [getValues('name'), user?.email, user?.birthday].every(hasValue)) {
        markSectionComplete('dados-basicos');
        setShowBasic(false);
      }
    });
  }

  function handleSavePhone() {
    const phone = getValues('candidateProfile.contacts.phone');

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          contacts: {
            ...user?.candidateProfile?.contacts,
            phone: {
              ...user?.candidateProfile?.contacts?.phone,
              ...phone,
            },
          },
        },
      },
      t('phoneSuccess'),
      t('phoneError'),
    ).then((saved) => {
      if (saved && [phone?.country, phone?.number].every(hasValue)) {
        markSectionComplete('telefone');
        setShowPhone(false);
      }
    });
  }

  function handleSaveDocuments() {
    const documents = getValues('candidateProfile.documents');

    const rg = documents?.rg;
    const cpf = documents?.cpf;
    const cref = documents?.cref;
    const passport = documents?.passport;

    const nextDocuments = {
      ...(hasValue(rg?.number)
        ? {
            rg: {
              number: String(rg?.number),
              issuer: hasValue(rg?.issuer) ? String(rg?.issuer) : '',
              state: hasValue(rg?.state) ? String(rg?.state) : '',
            },
          }
        : {}),

      ...(hasValue(cpf?.number)
        ? {
            cpf: {
              number: String(cpf?.number),
            },
          }
        : {}),

      ...(hasValue(cref?.number) || hasValue(cref?.category) || cref?.isActive
        ? {
            cref: {
              number: hasValue(cref?.number) ? String(cref?.number) : '',
              category: hasValue(cref?.category) ? String(cref?.category) : '',
              isActive: Boolean(cref?.isActive),
            },
          }
        : {}),

      ...(hasValue(passport?.number) ||
      hasValue(passport?.country) ||
      hasValue(passport?.expirationDate)
        ? {
            passport: {
              number: hasValue(passport?.number) ? String(passport?.number) : '',
              country: hasValue(passport?.country) ? String(passport?.country) : '',
              expirationDate: passport?.expirationDate as Date,
            },
          }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          documents: nextDocuments,
        },
      },
      t('documentsSuccess'),
      t('documentsError'),
    ).then((saved) => {
      if (saved && hasValue(cpf?.number)) {
        markSectionComplete('documentos');
        setShowContacts(false);
      }
    });
  }

  function handleSaveAddress() {
    const address = getValues('candidateProfile.contacts.address');
    const nextAddress = {
      ...(hasValue(address?.zipCode) ? { zipCode: address?.zipCode } : {}),
      ...(hasValue(address?.street) ? { street: address?.street } : {}),
      ...(hasValue(address?.number) ? { number: address?.number } : {}),
      ...(hasValue(address?.complement) ? { complement: address?.complement } : {}),
      ...(hasValue(address?.neighborhood) ? { neighborhood: address?.neighborhood } : {}),
      ...(hasValue(address?.city) ? { city: address?.city } : {}),
      ...(hasValue(address?.state) ? { state: address?.state } : {}),
      ...(hasValue(address?.country) ? { country: address?.country } : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          contacts: {
            ...user?.candidateProfile?.contacts,
            ...(Object.keys(nextAddress).length > 0 ? { address: nextAddress } : {}),
          },
        },
      },
      t('addressSuccess'),
      t('addressError'),
    ).then((saved) => {
      if (
        saved &&
        [
          address?.zipCode,
          address?.street,
          address?.number,
          address?.neighborhood,
          address?.city,
          address?.state,
          address?.country,
        ].every(hasValue)
      ) {
        markSectionComplete('endereco');
        setShowAddress(false);
      }
    });
  }

  function handleSaveMedia() {
    const resumeUrl = getValues('candidateProfile.media.resumeUrl');

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          media: {
            resumeUrl,
          },
        },
      },
      t('resumeSuccess'),
      t('resumeError'),
    ).then((saved) => {
      if (saved && hasValue(resumeUrl)) {
        markSectionComplete('midia');
        setShowMedia(false);
      }
    });
  }

  function handleSaveEthnicity() {
    const ethnicity = getValues('candidateProfile.ethnicity');

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ethnicity,
        },
      },
      t('ethnicitySuccess'),
      t('ethnicityError'),
    ).then((saved) => {
      if (saved && hasValue(ethnicity)) {
        markSectionComplete('etnia');
        setShowEthnicity(false);
      }
    });
  }

  function handleSaveDiversity() {
    const diversity = getValues('candidateProfile.diversity');
    const nextDiversity = {
      ...(hasValue(diversity?.genderIdentity) ? { genderIdentity: diversity?.genderIdentity } : {}),
      ...(hasValue(diversity?.sexualOrientation)
        ? { sexualOrientation: diversity?.sexualOrientation }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextDiversity).length > 0 ? { diversity: nextDiversity } : {}),
        },
      },
      t('diversitySuccess'),
      t('diversityError'),
    ).then((saved) => {
      if (saved && [diversity?.genderIdentity, diversity?.sexualOrientation].every(hasValue)) {
        markSectionComplete('diversidade');
        setShowDiversity(false);
      }
    });
  }

  function handleSavePhysicalAttributes() {
    const physicalAttributes = getValues('candidateProfile.physicalAttributes');
    const nextPhysicalAttributes = {
      ...(physicalAttributes?.height || physicalAttributes?.height === 0
        ? { height: physicalAttributes.height }
        : {}),
      ...(physicalAttributes?.weight || physicalAttributes?.weight === 0
        ? { weight: physicalAttributes.weight }
        : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextPhysicalAttributes).length > 0
            ? { physicalAttributes: nextPhysicalAttributes }
            : {}),
        },
      },
      t('physicalAttributesSuccess'),
      t('physicalAttributesError'),
    ).then((saved) => {
      if (saved && [physicalAttributes?.height, physicalAttributes?.weight].every(hasValue)) {
        markSectionComplete('atributos-fisicos');
        setShowPhysicalAttributes(false);
      }
    });
  }

  function handleSaveUniform() {
    const uniform = getValues('candidateProfile.uniform');
    const hasShoeUnit = hasValue(uniform?.shoeSizeUnit);
    const hasShoeSize = uniform?.shoeSize || uniform?.shoeSize === 0;

    if (hasShoeUnit !== Boolean(hasShoeSize)) {
      showError(t('shoeSizePairError'));
      return;
    }

    const nextUniform = {
      ...(hasValue(uniform?.tShirtSize) ? { tShirtSize: uniform?.tShirtSize } : {}),
      ...(hasValue(uniform?.jacketSize) ? { jacketSize: uniform?.jacketSize } : {}),
      ...(hasValue(uniform?.shortSize) ? { shortSize: uniform?.shortSize } : {}),
      ...(hasValue(uniform?.pantsSize) ? { pantsSize: uniform?.pantsSize } : {}),
      ...(hasShoeUnit ? { shoeSizeUnit: uniform?.shoeSizeUnit } : {}),
      ...(hasShoeSize ? { shoeSize: uniform?.shoeSize } : {}),
    };

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          ...(Object.keys(nextUniform).length > 0 ? { uniform: nextUniform } : {}),
        },
      },
      t('uniformSuccess'),
      t('uniformError'),
    ).then((saved) => {
      if (
        saved &&
        [
          uniform?.tShirtSize,
          uniform?.jacketSize,
          uniform?.shortSize,
          uniform?.pantsSize,
          uniform?.shoeSizeUnit,
          uniform?.shoeSize,
        ].every(hasValue)
      ) {
        markSectionComplete('uniforme');
        setShowUniform(false);
      }
    });
  }

  function handleSaveAvailability() {
    const availability = getValues('candidateProfile.availability') || [];

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          availability,
        },
      },
      t('availabilitySuccess'),
      t('availabilityError'),
    ).then((saved) => {
      if (saved && availability.length > 0) {
        markSectionComplete('disponibilidade');
        setShowAvailability(false);
      }
    });
  }

  function handleDeleteEducation(index: number) {
    setEducationIndexToDelete(index);
  }

  function confirmDeleteEducation() {
    if (educationIndexToDelete === null) {
      return;
    }

    const currentEducations = getValues('candidateProfile.educations') || [];
    const nextEducations = currentEducations.filter(
      (_, itemIndex) => itemIndex !== educationIndexToDelete,
    );

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          educations: nextEducations,
        },
      },
      t('educationDeleteSuccess'),
      t('educationDeleteError'),
    ).then((saved) => {
      if (!saved) {
        return;
      }

      removeEducation(educationIndexToDelete);
      setEducationIndexToDelete(null);
    });
  }

  function cancelDeleteEducation() {
    setEducationIndexToDelete(null);
  }

  function handleDeleteExperience(index: number) {
    setExperienceIndexToDelete(index);
  }

  function confirmDeleteExperience() {
    if (experienceIndexToDelete === null) {
      return;
    }

    const currentExperiences = getValues('candidateProfile.professionalExperiences') || [];
    const nextExperiences = currentExperiences.filter(
      (_, itemIndex) => itemIndex !== experienceIndexToDelete,
    );

    void submitCandidateUpdate(
      {
        candidateProfile: {
          ...user?.candidateProfile,
          professionalExperiences: nextExperiences,
        },
      },
      t('experienceDeleteSuccess'),
      t('experienceDeleteError'),
    ).then((saved) => {
      if (!saved) {
        return;
      }

      removeExperience(experienceIndexToDelete);
      setExperienceIndexToDelete(null);
    });
  }

  function cancelDeleteExperience() {
    setExperienceIndexToDelete(null);
  }

  return (
    <form className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-2 backdrop-blur">
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-6">
          {candidateProfileSections.map((section) => {
            const Icon = section.icon;
            const isComplete =
              visibleProfileCompletionBySection[section.id as CandidateProfileSectionId];

            return (
              <a
                key={section.titleKey}
                href={`#${section.id}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 hover:bg-white/[0.03] ${
                  isComplete
                    ? 'text-lime-400 hover:text-lime-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(section.titleKey)}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div id="dados-basicos" className={getSectionBoxClassName('dados-basicos')}>
        <ProfileSectionTitle
          title={t('basicData')}
          icon={GrDocumentText}
          onIconClick={() => setShowBasic((v) => !v)}
          iconClickable
          expanded={showBasic}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showBasic && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input
              label={t('name')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('name')}
              {...register('name')}
            />
            <div className="hidden md:block" />
            <Input
              label={t('email')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('email')}
              value={user?.email || ''}
              disabled
            />
            <Input
              label={t('birthday')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder={t('birthday')}
              value={formatBirthday(user?.birthday, locale)}
              disabled
            />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveBasic}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div id="telefone" className={getSectionBoxClassName('telefone')}>
        <ProfileSectionTitle
          title={t('phone')}
          icon={FaPhoneSquare}
          onIconClick={() => setShowPhone((v) => !v)}
          iconClickable
          expanded={showPhone}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showPhone && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <PhoneInput
                label={t('phone')}
                labelClassName={labelClassName}
                countryValue={phoneCountryValue || '+55'}
                numberValue={phoneNumberValue || ''}
                onCountryChange={(value) =>
                  setValue('candidateProfile.contacts.phone.country', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                onNumberChange={(value) =>
                  setValue('candidateProfile.contacts.phone.number', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            </div>
            <div className="flex items-end">
              <div className="grid w-full gap-3 md:grid-cols-2">
                <label className={`${optionCardClassName} flex-1`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-lime-400"
                    {...register('candidateProfile.contacts.phone.isWhatsapp')}
                  />
                  <FaWhatsapp className="h-5 w-5 text-lime-400" />
                  <span>WhatsApp</span>
                </label>
                <label className={`${optionCardClassName} flex-1`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-lime-400"
                    {...register('candidateProfile.contacts.phone.isTelegram')}
                  />
                  <FaTelegramPlane className="h-5 w-5 text-lime-400" />
                  <span>Telegram</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSavePhone}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="endereco" className={getSectionBoxClassName('endereco')}>
        <ProfileSectionTitle
          title={t('address')}
          icon={MdOutlinePlace}
          onIconClick={() => setShowAddress((v) => !v)}
          iconClickable
          expanded={showAddress}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showAddress && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={t('zipCode')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="01310-100"
                {...zipCodeField}
                onChange={(event) => {
                  clearZipCodeError();
                  zipCodeField.onChange(event);
                }}
                onBlur={(event) => {
                  zipCodeField.onBlur(event);
                  void handleZipCodeLookup(event.target.value);
                }}
              />
              <div className="hidden md:block" />
            </div>
            <div className="hidden md:block" />
            {isZipCodeLoading && (
              <div className="md:col-span-2">
                <p className="text-sm text-zinc-400">{t('checkingZipCode')}</p>
              </div>
            )}
            {zipCodeError && (
              <div className="md:col-span-2">
                <p className="text-sm text-red-100">{zipCodeError}</p>
              </div>
            )}

            <Input
              label={t('street')}
              labelClassName={labelClassName}
              className={fieldClassName}
              placeholder="Avenida Paulista"
              {...register('candidateProfile.contacts.address.street')}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={t('number')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="1578"
                {...register('candidateProfile.contacts.address.number')}
              />
              <Input
                label={t('complement')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder="Conjunto 201"
                {...register('candidateProfile.contacts.address.complement')}
              />
            </div>

            <div className="contents md:hidden">
              <Input
                label={t('neighborhood')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('neighborhood')}
                {...register('candidateProfile.contacts.address.neighborhood')}
              />
              <Input
                label={t('city')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('city')}
                {...register('candidateProfile.contacts.address.city')}
              />
              <Input
                label={t('state')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('state')}
                {...register('candidateProfile.contacts.address.state')}
              />
              <Input
                label={t('country')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('country')}
                {...register('candidateProfile.contacts.address.country')}
              />
            </div>
            <div className="hidden gap-4 md:grid md:grid-cols-2 md:col-span-2">
              <div className="grid gap-4 grid-cols-2">
                <Input
                  label={t('neighborhood')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Bela Vista"
                  {...register('candidateProfile.contacts.address.neighborhood')}
                />
                <Input
                  label={t('city')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="São Paulo"
                  {...register('candidateProfile.contacts.address.city')}
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <Input
                  label={t('state')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SP"
                  {...register('candidateProfile.contacts.address.state')}
                />
                <Input
                  label={t('country')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Brasil"
                  {...register('candidateProfile.contacts.address.country')}
                />
              </div>
            </div>

            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveAddress}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="documentos" className={getSectionBoxClassName('documentos')}>
        <ProfileSectionTitle
          title={t('documents')}
          icon={FaPassport}
          onIconClick={() => setShowContacts((v) => !v)}
          iconClickable
          expanded={showContacts}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showContacts && (
          <div className="mt-6 space-y-4">
            <div className={nestedCardClassName}>
              <h3 className={nestedSectionTitleClassName}>RG</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('number')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="45.678.901-2"
                  {...register('candidateProfile.documents.rg.number')}
                />
                <div className="hidden md:block" />
                <Input
                  label={t('issuingAgency')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SSP-SP"
                  {...register('candidateProfile.documents.rg.issuer')}
                />
                <Input
                  label={t('issuingState')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="SP"
                  {...register('candidateProfile.documents.rg.state')}
                />
              </div>
            </div>

            <div className={nestedCardClassName}>
              <h3 className={nestedSectionTitleClassName}>CPF</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('number')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="123.456.789-00"
                  {...register('candidateProfile.documents.cpf.number')}
                />
                <div className="hidden md:block" />
              </div>
            </div>

            <div className={nestedCardClassName}>
              <h3 className={nestedSectionTitleClassName}>CREF</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className={`${optionCardClassName} self-end`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-lime-400"
                    {...register('candidateProfile.documents.cref.isActive')}
                  />
                  <span>{t('active')}</span>
                </label>
                <div className="hidden md:block" />
                <Input
                  label="CREF"
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="123456-G/SP"
                  {...register('candidateProfile.documents.cref.number')}
                />
                <Input
                  label={t('crefCategory')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Provisório"
                  {...register('candidateProfile.documents.cref.category')}
                />
              </div>
            </div>

            <div className={nestedCardClassName}>
              <h3 className={nestedSectionTitleClassName}>{t('passport')}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('code')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="AB123456"
                  {...register('candidateProfile.documents.passport.number')}
                />
                <div className="hidden md:block" />
                <Input
                  label={t('country')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="Brasil"
                  {...register('candidateProfile.documents.passport.country')}
                />
                <Input
                  label={t('expiration')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  placeholder="10/12/2030"
                  {...register('candidateProfile.documents.passport.expirationDate')}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveDocuments}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="midia" className={getSectionBoxClassName('midia')}>
        <ProfileSectionTitle
          title={t('media')}
          icon={BsFiles}
          onIconClick={() => setShowMedia((v) => !v)}
          iconClickable
          expanded={showMedia}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showMedia && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FileUpload
                label={t('resumePdf')}
                accept=".pdf,application/pdf"
                value={resumeUrlValue}
                onUpload={async (file) => {
                  const response = await UploadService.uploadResume(file);

                  setValue('candidateProfile.media.resumeUrl', response.url, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });

                  return response.url;
                }}
              />
              <input type="hidden" {...register('candidateProfile.media.resumeUrl')} />
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveMedia}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="etnia" className={getSectionBoxClassName('etnia')}>
        <ProfileSectionTitle
          title={t('ethnicity')}
          icon={FaGlobeAmericas}
          onIconClick={() => setShowEthnicity((v) => !v)}
          iconClickable
          expanded={showEthnicity}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showEthnicity && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Select
              label={t('ethnicity')}
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(EthnicityTypeEnum).map((value) => ({
                value,
                label: getEthnicityLabel(value, t),
              }))}
              {...register('candidateProfile.ethnicity')}
            />
            <div className="hidden md:block" />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveEthnicity}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="diversidade" className={getSectionBoxClassName('diversidade')}>
        <ProfileSectionTitle
          title={t('diversity')}
          icon={MdDiversity2}
          onIconClick={() => setShowDiversity((v) => !v)}
          iconClickable
          expanded={showDiversity}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showDiversity && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Select
              label={t('genderIdentity')}
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(GenderIdentityEnum).map((value) => ({
                value,
                label: getGenderIdentityLabel(value, t),
              }))}
              {...register('candidateProfile.diversity.genderIdentity')}
            />
            <Select
              label={t('sexualOrientation')}
              labelClassName={labelClassName}
              className={fieldClassName}
              options={Object.values(SexualOrientationEnum).map((value) => ({
                value,
                label: getSexualOrientationLabel(value, t),
              }))}
              {...register('candidateProfile.diversity.sexualOrientation')}
            />
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveDiversity}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="atributos-fisicos" className={getSectionBoxClassName('atributos-fisicos')}>
        <ProfileSectionTitle
          title={t('physicalAttributes')}
          icon={GiBodyHeight}
          onIconClick={() => setShowPhysicalAttributes((v) => !v)}
          iconClickable
          expanded={showPhysicalAttributes}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showPhysicalAttributes && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                {t('heightCm')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.height',
                      heightValue,
                      -0.01,
                      0,
                      2,
                    )
                  }
                  className={stepperButtonClassName}
                  aria-label={t('decreaseHeight')}
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div
                  className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4`}
                >
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className={numericInputClassName}
                    placeholder="1.60"
                    {...register('candidateProfile.physicalAttributes.height', {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="ml-2 shrink-0 text-sm font-medium text-zinc-400">CM</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.height',
                      heightValue,
                      0.01,
                      0,
                      2,
                    )
                  }
                  className={stepperButtonClassName}
                  aria-label={t('increaseHeight')}
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                {t('weightKg')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.weight',
                      weightValue,
                      -0.01,
                      0,
                      2,
                    )
                  }
                  className={stepperButtonClassName}
                  aria-label={t('decreaseWeight')}
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div
                  className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4`}
                >
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className={numericInputClassName}
                    placeholder="70"
                    {...register('candidateProfile.physicalAttributes.weight', {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="ml-2 shrink-0 text-sm font-medium text-zinc-400">KG</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateNumericField(
                      'candidateProfile.physicalAttributes.weight',
                      weightValue,
                      0.01,
                      0,
                      2,
                    )
                  }
                  className={stepperButtonClassName}
                  aria-label={t('increaseWeight')}
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSavePhysicalAttributes}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="uniforme" className={getSectionBoxClassName('uniforme')}>
        <ProfileSectionTitle
          title={t('uniform')}
          icon={GiBodySwapping}
          onIconClick={() => setShowUniform((v) => !v)}
          iconClickable
          expanded={showUniform}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showUniform && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label={t('tShirtSize')}
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={FaTshirt}
              options={Object.values(ClothingSizeEnum).map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
              {...register('candidateProfile.uniform.tShirtSize')}
            />
            <Select
              label={t('jacketSize')}
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiMonclerJacket}
              options={Object.values(ClothingSizeEnum).map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
              {...register('candidateProfile.uniform.jacketSize')}
            />
            <Select
              label={t('shortsSize')}
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiUnderwearShorts}
              options={Object.values(ClothingSizeEnum).map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
              {...register('candidateProfile.uniform.shortSize')}
            />
            <Select
              label={t('pantsSize')}
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={PiPantsFill}
              options={Object.values(ClothingSizeEnum).map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
              {...register('candidateProfile.uniform.pantsSize')}
            />
            <Select
              label={t('shoeSizeUnit')}
              labelClassName={labelClassName}
              className={fieldClassName}
              leftIcon={GiConverseShoe}
              options={Object.values(ShoesSizeUnitEnum).map((value) => ({
                value,
                label: value.toUpperCase(),
              }))}
              {...register('candidateProfile.uniform.shoeSizeUnit')}
            />
            <div>
              <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                {t('shoeSize')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!hasShoeSizeUnit}
                  onClick={() =>
                    updateNumericField('candidateProfile.uniform.shoeSize', shoeSizeValue, -1, 0, 0)
                  }
                  className={stepperButtonClassName}
                  aria-label={t('decreaseShoeSize')}
                >
                  <FiMinusCircle className="h-6 w-6" />
                </button>
                <div
                  className={`${fieldClassName} flex h-[50px] flex-1 items-center rounded-xl px-4 ${!hasShoeSizeUnit ? 'opacity-60' : ''}`}
                >
                  <input
                    type="number"
                    min={0}
                    step={1}
                    disabled={!hasShoeSizeUnit}
                    className={`${numericInputClassName} disabled:cursor-not-allowed`}
                    placeholder="36"
                    {...register('candidateProfile.uniform.shoeSize', {
                      valueAsNumber: true,
                      validate: (value) => {
                        if ((value || value === 0) && !shoeSizeUnitValue) {
                          return t('shoeUnitRequired');
                        }

                        return true;
                      },
                    })}
                  />
                  {shoeSizeUnitValue && (
                    <span className="ml-2 shrink-0 text-sm font-medium uppercase text-zinc-400">
                      {shoeSizeUnitValue}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!hasShoeSizeUnit}
                  onClick={() =>
                    updateNumericField('candidateProfile.uniform.shoeSize', shoeSizeValue, 1, 0, 0)
                  }
                  className={stepperButtonClassName}
                  aria-label={t('increaseShoeSize')}
                >
                  <FiPlusCircle className="h-6 w-6" />
                </button>
              </div>
              {errors.candidateProfile?.uniform?.shoeSize?.message && (
                <p className="mt-2 text-sm text-red-100">
                  {errors.candidateProfile.uniform.shoeSize.message}
                </p>
              )}
            </div>
            <div className="flex justify-end md:col-span-2 lg:col-span-3">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveUniform}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div id="formacao" className={getSectionBoxClassName('formacao')}>
        <ProfileSectionTitle
          title={t('education')}
          icon={GiGraduateCap}
          onIconClick={() => setShowEducation((v) => !v)}
          iconClickable
          expanded={showEducation}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showEducation && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-start">
              <Button
                type="button"
                variant="login"
                icon={<FiPlusCircle />}
                onClick={handleOpenEducationModal}
              >
                {t('addEducation')}
              </Button>
            </div>
            {educationFields.map((education, index) => (
              <div
                key={education.id}
                className={`grid gap-4 md:grid-cols-2 ${nestedCardClassName}`}
              >
                <div className="md:col-span-2">
                  <h3 className={nestedSectionTitleClassName}>
                    {t('educationNumber', { number: String(index + 1).padStart(2, '0') })}
                  </h3>
                </div>
                <Input
                  label={t('ongoing')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.isOngoing ? t('yes') : t('no')}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label={t('course')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.courseName}
                  disabled
                />
                <Input
                  label={t('institution')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.institution}
                  disabled
                />
                <Input
                  label={t('startYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(education.startYear)}
                  disabled
                />
                <Input
                  label={t('endYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={education.isOngoing ? t('ongoing') : String(education.endYear || '')}
                  disabled
                />
                <div className="flex justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    icon={<FaRegTrashAlt />}
                    disabled={isSubmitting}
                    onClick={() => handleDeleteEducation(index)}
                  >
                    {t('deleteEducationNumber', { number: String(index + 1).padStart(2, '0') })}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        id="experiencias-profissionais"
        className={getSectionBoxClassName('experiencias-profissionais')}
      >
        <ProfileSectionTitle
          title={t('professionalExperiences')}
          icon={GrCertificate}
          onIconClick={() => setShowExperiences((v) => !v)}
          iconClickable
          expanded={showExperiences}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showExperiences && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-start">
              <Button
                type="button"
                variant="login"
                icon={<FiPlusCircle />}
                onClick={handleOpenExperienceModal}
              >
                {t('addProfessionalExperience')}
              </Button>
            </div>
            {experienceFields.map((experience, index) => (
              <div
                key={experience.id}
                className={`grid gap-4 md:grid-cols-2 ${nestedCardClassName}`}
              >
                <div className="md:col-span-2">
                  <h3 className={nestedSectionTitleClassName}>
                    {t('professionalExperienceNumber', {
                      number: String(index + 1).padStart(2, '0'),
                    })}
                  </h3>
                </div>
                <Input
                  label={t('current')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.isCurrent ? t('yes') : t('no')}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label={t('company')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.companyName}
                  disabled
                />
                <Input
                  label={t('position')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.role}
                  disabled
                />
                <Input
                  label={t('startYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(experience.startYear)}
                  disabled
                />
                <Input
                  label={t('endYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experience.isCurrent ? t('current') : String(experience.endYear || '')}
                  disabled
                />
                <div className="flex justify-end md:col-span-2">
                  <Button
                    type="button"
                    variant="danger"
                    icon={<FaRegTrashAlt />}
                    disabled={isSubmitting}
                    onClick={() => handleDeleteExperience(index)}
                  >
                    {t('deleteProfessionalExperienceNumber', {
                      number: String(index + 1).padStart(2, '0'),
                    })}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="disponibilidade" className={getSectionBoxClassName('disponibilidade')}>
        <ProfileSectionTitle
          title={t('availability')}
          icon={MdEventAvailable}
          onIconClick={() => setShowAvailability((v) => !v)}
          iconClickable
          expanded={showAvailability}
          titleClassName={sectionTitleClassName}
          iconClassName={sectionIconClassName}
          toggleIconClassName={sectionToggleIconClassName}
        />
        {showAvailability && (
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {Object.values(AvailabilityShiftEnum).map((value) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={value}
                  {...register('candidateProfile.availability')}
                />
                {getAvailabilityShiftLabel(value, t)}
              </label>
            ))}
            <div className="flex justify-end md:col-span-2">
              <Button
                type="button"
                variant="positive"
                icon={<Save className="h-4 w-4" />}
                disabled={isSubmitting}
                onClick={handleSaveAvailability}
                className={saveButtonClassName}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className={modalCardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className={modalHeadingClassName}>
                <GiGraduateCap className="h-5 w-5 shrink-0 text-lime-400" />
                <h2>{t('registerEducationNumber', { number: nextEducationNumber })}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEducationModalOpen(false)}
                className={modalCloseButtonClassName}
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={`${optionCardClassName} self-end`}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-lime-400"
                  checked={educationDraft.isOngoing}
                  onChange={(event) =>
                    setEducationDraft((current) => ({
                      ...current,
                      isOngoing: event.target.checked,
                    }))
                  }
                />
                <span>{t('ongoing')}</span>
              </label>
              <Select
                label={t('courseType')}
                labelClassName={labelClassName}
                className={fieldClassName}
                options={courseTypeOptions}
                value={educationDraft.courseType}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    courseType: event.target.value,
                  }))
                }
              />

              <Input
                label={t('course')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('course')}
                value={educationDraft.courseName}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    courseName: event.target.value,
                  }))
                }
              />
              <Input
                label={t('institution')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('institution')}
                value={educationDraft.institution}
                onChange={(event) =>
                  setEducationDraft((current) => ({
                    ...current,
                    institution: event.target.value,
                  }))
                }
              />

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  {t('startYear')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('startYear', -1)}
                    className={stepperButtonClassName}
                    aria-label={t('decreaseStartYear')}
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={educationDraft.startYear}
                    onChange={(event) =>
                      setEducationDraft((current) => ({
                        ...current,
                        startYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('startYear', 1)}
                    className={stepperButtonClassName}
                    aria-label={t('increaseStartYear')}
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  {educationDraft.isOngoing ? t('expectedEndYear') : t('endYear')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('endYear', -1)}
                    className={stepperButtonClassName}
                    aria-label={t('decreaseEndYear')}
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={educationDraft.endYear}
                    onChange={(event) =>
                      setEducationDraft((current) => ({
                        ...current,
                        endYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateEducationDraftYear('endYear', 1)}
                    className={stepperButtonClassName}
                    aria-label={t('increaseEndYear')}
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="positive"
                  icon={<Save className="h-4 w-4" />}
                  onClick={handleSaveEducation}
                  className={saveButtonClassName}
                >
                  {t('save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className={modalCardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className={modalHeadingClassName}>
                <Save className="h-5 w-5 shrink-0 text-lime-400" />
                <h2>
                  {t('registerProfessionalExperienceNumber', { number: nextExperienceNumber })}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsExperienceModalOpen(false)}
                className={modalCloseButtonClassName}
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={`${optionCardClassName} self-end`}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-lime-400"
                  checked={experienceDraft.isCurrent}
                  onChange={(event) =>
                    setExperienceDraft((current) => ({
                      ...current,
                      isCurrent: event.target.checked,
                    }))
                  }
                />
                <span>{t('current')}</span>
              </label>
              <div className="hidden md:block" />

              <Input
                label={t('company')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('company')}
                value={experienceDraft.companyName}
                onChange={(event) =>
                  setExperienceDraft((current) => ({
                    ...current,
                    companyName: event.target.value,
                  }))
                }
              />
              <Input
                label={t('position')}
                labelClassName={labelClassName}
                className={fieldClassName}
                placeholder={t('position')}
                value={experienceDraft.role}
                onChange={(event) =>
                  setExperienceDraft((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
              />

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  {t('startYear')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('startYear', -1)}
                    className={stepperButtonClassName}
                    aria-label={t('decreaseExperienceStartYear')}
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={experienceDraft.startYear}
                    onChange={(event) =>
                      setExperienceDraft((current) => ({
                        ...current,
                        startYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('startYear', 1)}
                    className={stepperButtonClassName}
                    aria-label={t('increaseExperienceStartYear')}
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div>
                <label className={`mb-1 block text-sm font-medium ${labelClassName}`}>
                  {t('endYear')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('endYear', -1)}
                    disabled={experienceDraft.isCurrent}
                    className={stepperButtonClassName}
                    aria-label={t('decreaseExperienceEndYear')}
                  >
                    <FiMinusCircle className="h-6 w-6" />
                  </button>
                  <input
                    type="number"
                    disabled={experienceDraft.isCurrent}
                    className={`${fieldClassName} h-[50px] flex-1 text-center appearance-none disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    value={experienceDraft.isCurrent ? currentYear : experienceDraft.endYear}
                    onChange={(event) =>
                      setExperienceDraft((current) => ({
                        ...current,
                        endYear: Number(event.target.value) || currentYear,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateExperienceDraftYear('endYear', 1)}
                    disabled={experienceDraft.isCurrent}
                    className={stepperButtonClassName}
                    aria-label={t('increaseExperienceEndYear')}
                  >
                    <FiPlusCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button
                  type="button"
                  variant="positive"
                  icon={<Save className="h-4 w-4" />}
                  onClick={handleSaveExperience}
                  className={saveButtonClassName}
                >
                  {t('save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {educationIndexToDelete !== null && educationFields[educationIndexToDelete] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className={modalCardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className={modalHeadingClassName}>
                <FaRegTrashAlt className="h-5 w-5 shrink-0 text-lime-400" />
                <h2>
                  {t('deleteEducationNumber', {
                    number: String(educationIndexToDelete + 1).padStart(2, '0'),
                  })}
                </h2>
              </div>
              <button
                type="button"
                onClick={cancelDeleteEducation}
                className={modalCloseButtonClassName}
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className={modalDescriptionClassName}>{t('confirmEducationDelete')}</p>

              <div className={`grid gap-4 md:grid-cols-2 ${nestedCardClassName}`}>
                <Input
                  label={t('ongoing')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].isOngoing ? t('yes') : t('no')}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label={t('course')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].courseName}
                  disabled
                />
                <Input
                  label={t('institution')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={educationFields[educationIndexToDelete].institution}
                  disabled
                />
                <Input
                  label={t('startYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(educationFields[educationIndexToDelete].startYear)}
                  disabled
                />
                <Input
                  label={t('endYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={
                    educationFields[educationIndexToDelete].isOngoing
                      ? t('ongoing')
                      : String(educationFields[educationIndexToDelete].endYear || '')
                  }
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="profile" onClick={cancelDeleteEducation}>
                  {t('cancel')}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaRegTrashAlt />}
                  disabled={isSubmitting}
                  onClick={confirmDeleteEducation}
                >
                  {t('deleteEducationNumber', {
                    number: String(educationIndexToDelete + 1).padStart(2, '0'),
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {experienceIndexToDelete !== null && experienceFields[experienceIndexToDelete] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className={modalCardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className={modalHeadingClassName}>
                <FaRegTrashAlt className="h-5 w-5 shrink-0 text-lime-400" />
                <h2>
                  {t('deleteProfessionalExperienceNumber', {
                    number: String(experienceIndexToDelete + 1).padStart(2, '0'),
                  })}
                </h2>
              </div>
              <button
                type="button"
                onClick={cancelDeleteExperience}
                className={modalCloseButtonClassName}
                aria-label={t('closeModal')}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className={modalDescriptionClassName}>
                {t('confirmProfessionalExperienceDelete')}
              </p>

              <div className={`grid gap-4 md:grid-cols-2 ${nestedCardClassName}`}>
                <Input
                  label={t('current')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].isCurrent ? t('yes') : t('no')}
                  disabled
                />
                <div className="hidden md:block" />
                <Input
                  label={t('company')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].companyName}
                  disabled
                />
                <Input
                  label={t('position')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={experienceFields[experienceIndexToDelete].role}
                  disabled
                />
                <Input
                  label={t('startYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={String(experienceFields[experienceIndexToDelete].startYear)}
                  disabled
                />
                <Input
                  label={t('endYear')}
                  labelClassName={labelClassName}
                  className={fieldClassName}
                  value={
                    experienceFields[experienceIndexToDelete].isCurrent
                      ? t('current')
                      : String(experienceFields[experienceIndexToDelete].endYear || '')
                  }
                  disabled
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="profile" onClick={cancelDeleteExperience}>
                  {t('cancel')}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  icon={<FaRegTrashAlt />}
                  disabled={isSubmitting}
                  onClick={confirmDeleteExperience}
                >
                  {t('deleteProfessionalExperienceNumber', {
                    number: String(experienceIndexToDelete + 1).padStart(2, '0'),
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
